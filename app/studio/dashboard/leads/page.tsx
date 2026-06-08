"use client";

import { useEffect, useState } from "react";

type Lead = Record<string, unknown>;

function fmtDate(v: unknown) {
  if (!v) return "";
  try { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(String(v))); }
  catch { return String(v); }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((j) => { setLeads(j.leads || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function exportCSV() {
    if (!leads.length) return;
    const allKeys = Array.from(new Set(leads.flatMap((l) => Object.keys(l).filter((k) => k !== "_id"))));
    const rows = [allKeys.join(",")];
    for (const lead of leads) {
      rows.push(allKeys.map((k) => JSON.stringify(lead[k] ?? "")).join(","));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = leads.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return Object.values(l).some((v) => String(v).toLowerCase().includes(q));
  });

  const displayKeys = ["name", "email", "company", "message", "phone", "source", "receivedAt"].filter((k) =>
    leads.some((l) => l[k])
  );

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">{leads.length} contact form submission{leads.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={!leads.length}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
        >
          ↓ Export CSV
        </button>
      </div>

      {leads.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No leads yet. Contact form submissions will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm text-sm text-slate-400">
          No leads match &quot;{search}&quot;
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {displayKeys.map((k) => (
                  <th key={k} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 capitalize">
                    {k === "receivedAt" ? "Date" : k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={String(lead._id || i)} className={i < filtered.length - 1 ? "border-b border-slate-50 hover:bg-slate-50/50" : "hover:bg-slate-50/50"}>
                  {displayKeys.map((k) => (
                    <td key={k} className="px-4 py-3 text-slate-700 max-w-[200px]">
                      {k === "receivedAt" ? (
                        <span className="text-xs text-slate-500">{fmtDate(lead[k])}</span>
                      ) : k === "email" ? (
                        <a href={`mailto:${lead[k]}`} className="text-blue-600 hover:underline truncate block">
                          {String(lead[k] || "")}
                        </a>
                      ) : k === "message" ? (
                        <span className="block truncate text-xs text-slate-600" title={String(lead[k] || "")}>
                          {String(lead[k] || "").slice(0, 80)}{String(lead[k] || "").length > 80 ? "…" : ""}
                        </span>
                      ) : (
                        <span className="truncate block">{String(lead[k] || "")}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
