import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import {
  createRateLimiter,
  escapeHtml,
  isValidEmail,
} from "@/lib/security";
import { getAdminEmails } from "@/lib/admin";
import { sendDiscordContactNotification, type ContactNotification } from "@/lib/notify/discord";

// Created lazily so builds and local/e2e runs work without RESEND_API_KEY.
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  /** Honeypot: hidden from humans, bots tend to fill it. */
  website?: string;
}

const LIMITS = { name: 100, email: 254, company: 120, service: 120, message: 5000 };
// 5 submissions per IP per 10 minutes (per server instance).
const allowRequest = createRateLimiter(5, 10 * 60 * 1000);

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function asTrimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    if (!allowRequest(clientIp(request))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Partial<ContactFormData>;

    // Bots fill the hidden field; pretend success so they don't retry.
    if (asTrimmed(body.website)) {
      return NextResponse.json({ success: true });
    }

    const name = asTrimmed(body.name);
    const email = asTrimmed(body.email);
    const company = asTrimmed(body.company);
    const service = asTrimmed(body.service);
    const message = asTrimmed(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (
      name.length > LIMITS.name ||
      company.length > LIMITS.company ||
      service.length > LIMITS.service ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long" },
        { status: 400 }
      );
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      company: escapeHtml(company),
      service: escapeHtml(service),
      message: escapeHtml(message).replace(/\n/g, "<br>"),
    };

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from("contacts")
      .insert([
        {
          name,
          email,
          company: company || null,
          service: service || null,
          message,
          created_at: new Date().toISOString(),
          read: false,
        },
      ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save contact" },
        { status: 500 }
      );
    }

    // Notify on every configured channel in parallel. The contact is already
    // saved, so a failing channel is logged and never fails the request.
    const notification = { name, email, company, service, message };
    await Promise.allSettled([
      sendEmailNotification(notification, safe),
      sendDiscordContactNotification(notification),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(
  { name, email, company, service, message }: ContactNotification,
  safe: { name: string; email: string; company: string; service: string; message: string }
): Promise<void> {
  // Same allow-list as the dashboard (ADMIN_EMAILS → ADMIN_EMAIL → owner).
  const adminEmail = getAdminEmails()[0];
  const emailSubject = service
    ? `New Contact: ${service} - ${name}`.replace(/[\r\n]+/g, " ")
    : `New Contact from ${name}`.replace(/[\r\n]+/g, " ");

  const mailer = getResend();
  if (!mailer) {
    console.warn("RESEND_API_KEY not set — email notification skipped");
    return;
  }

  try {
    await mailer.emails.send({
      from: "Portfolio Contact <thanaphat-north@resend.dev>",
      to: adminEmail,
      subject: emailSubject,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        ...(company ? [`Company: ${company}`] : []),
        ...(service ? [`Service: ${service}`] : []),
        "",
        message,
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff5a1f; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .footer { padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${safe.name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${safe.email}">${safe.email}</a></div>
              </div>
              ${
                company
                  ? `
              <div class="field">
                <div class="label">Company</div>
                <div class="value">${safe.company}</div>
              </div>
              `
                  : ""
              }
              ${
                service
                  ? `
              <div class="field">
                <div class="label">Service Interested In</div>
                <div class="value">${safe.service}</div>
              </div>
              `
                  : ""
              }
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${safe.message}</div>
              </div>
            </div>
            <div class="footer">
              Sent from your portfolio website at ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (emailError) {
    // Log email error but don't fail the request
    console.error("Email sending error:", emailError);
  }
}
