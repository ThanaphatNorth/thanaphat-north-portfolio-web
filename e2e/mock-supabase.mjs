// Minimal PostgREST/Supabase stand-in for local e2e runs (no real database needed).
// Serves the fixtures in ./fixtures — public content captured from the live site.
import http from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.join(dir, "fixtures", `${name}.json`), "utf8"));

const tables = {
  portfolios: load("portfolios"),
  ventures: load("ventures"),
  blog_posts: load("blog_posts"),
  site_settings: [
    { key: "career_start_date", value: "2017-06-01" },
    { key: "leadership_start_date", value: "2020-07-01" },
  ],
  contacts: [],
};

const PORT = Number(process.env.MOCK_SUPABASE_PORT || 54329);

function applyFilters(rows, params) {
  let out = rows;
  for (const [k, v] of params) {
    if (["select", "order", "limit", "offset"].includes(k)) continue;
    const [op, ...rest] = v.split(".");
    const val = rest.join(".");
    if (op === "eq") out = out.filter((r) => String(r[k]) === val);
    if (op === "in") {
      const list = val.replace(/^\(|\)$/g, "").split(",").map((s) => s.replace(/"/g, ""));
      out = out.filter((r) => list.includes(String(r[k])));
    }
  }
  const order = params.get("order");
  if (order) {
    const [col, dirn] = order.split(".");
    out = [...out].sort((a, b) => (a[col] > b[col] ? 1 : -1) * (dirn === "desc" ? -1 : 1));
  }
  const limit = params.get("limit");
  if (limit) out = out.slice(0, Number(limit));
  return out;
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const send = (status, body) => {
      res.writeHead(status, { "content-type": "application/json", "access-control-allow-origin": "*" });
      res.end(JSON.stringify(body));
    };
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
      });
      return res.end();
    }
    if (url.pathname.startsWith("/auth/v1/")) return send(401, { message: "no session (mock)" });

    const m = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
    if (!m || !tables[m[1]]) return send(404, { message: "not found (mock)" });
    const table = m[1];

    if (req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        tables[table].push(...[].concat(JSON.parse(body || "[]")));
        send(201, []);
      });
      return;
    }

    const rows = applyFilters(tables[table], url.searchParams);
    const single = (req.headers.accept || "").includes("vnd.pgrst.object");
    if (single) return rows[0] ? send(200, rows[0]) : send(406, { code: "PGRST116", message: "no rows" });
    send(200, rows);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`mock supabase on http://127.0.0.1:${PORT}`));
