"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  Filter,
  Building2,
  Calendar,
  Briefcase,
  Loader2,
  Inbox,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  created_at: string;
  read: boolean;
}

type FilterType = "all" | "unread" | "read";

export default function AdminDashboard() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "unread") {
      query = query.eq("read", false);
    } else if (filter === "read") {
      query = query.eq("read", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      setContacts(data || []);
    }
    setIsLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleToggleRead = async (contact: Contact) => {
    const newReadStatus = !contact.read;
    const { error } = await supabase
      .from("contacts")
      .update({ read: newReadStatus })
      .eq("id", contact.id);

    if (!error) {
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, read: newReadStatus } : c))
      );
      if (selectedContact?.id === contact.id) {
        setSelectedContact({ ...selectedContact, read: newReadStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    setIsDeleting(id);
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (!error) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
    setIsDeleting(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">
              Contact Dashboard
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchContacts}
              className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
              title="Refresh"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Filter size={18} className="text-muted" />
          {(["all", "unread", "read"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-card text-muted hover:text-foreground border border-border"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                Contacts ({contacts.length})
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted">
                  <Inbox size={48} className="mb-4" />
                  <p>No contacts found</p>
                </div>
              ) : (
                <AnimatePresence>
                  {contacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 border-b border-border cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id
                          ? "bg-accent/10"
                          : "hover:bg-background"
                      } ${!contact.read ? "border-l-4 border-l-accent" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span
                          className={`font-medium ${
                            contact.read ? "text-muted" : "text-foreground"
                          }`}
                        >
                          {contact.name}
                        </span>
                        {!contact.read && (
                          <span className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                      <p className="text-sm text-muted truncate">
                        {contact.email}
                      </p>
                      {contact.service && (
                        <p className="text-xs text-accent mt-1 truncate">
                          {contact.service}
                        </p>
                      )}
                      <p className="text-xs text-muted mt-2">
                        {formatDate(contact.created_at)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl">
            {selectedContact ? (
              <div className="h-full flex flex-col">
                {/* Detail Header */}
                <div className="p-6 border-b border-border flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {selectedContact.name}
                    </h2>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-accent hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedContact)}
                      className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
                      title={selectedContact.read ? "Mark as unread" : "Mark as read"}
                    >
                      {selectedContact.read ? (
                        <Mail size={20} />
                      ) : (
                        <MailOpen size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedContact.id)}
                      disabled={isDeleting === selectedContact.id}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                      title="Delete"
                    >
                      {isDeleting === selectedContact.id ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedContact.company && (
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Building2 size={18} className="text-muted" />
                        <div>
                          <p className="text-xs text-muted">Company</p>
                          <p className="text-foreground">
                            {selectedContact.company}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedContact.service && (
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Briefcase size={18} className="text-muted" />
                        <div>
                          <p className="text-xs text-muted">Service</p>
                          <p className="text-foreground">
                            {selectedContact.service}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                      <Calendar size={18} className="text-muted" />
                      <div>
                        <p className="text-xs text-muted">Received</p>
                        <p className="text-foreground">
                          {formatDate(selectedContact.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted mb-2">
                      Message
                    </h3>
                    <div className="p-4 bg-background rounded-lg text-foreground whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>

                  {/* Quick Reply */}
                  <div className="mt-6">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${
                        selectedContact.service || "Your inquiry"
                      }`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
                    >
                      <Mail size={18} />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted">
                <div className="text-center">
                  <Inbox size={48} className="mx-auto mb-4" />
                  <p>Select a contact to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
