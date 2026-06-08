"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
};

const NAV: NavItem[] = [
  {
    href: "/studio/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A2.25 2.25 0 0 1 9.25 5.5h1.5A2.25 2.25 0 0 1 13 7.75v.5a2.25 2.25 0 0 1-1.96 2.236A2.25 2.25 0 0 1 9.25 13h-1.5v-.75h1.5a1.5 1.5 0 0 0 0-3h-1.5A1.5 1.5 0 0 1 6.25 7.75v-.5A1.5 1.5 0 0 1 7.75 5.75" />
        <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0A8 8 0 0 1 2 10Zm8-6a6 6 0 1 0 0 12A6 6 0 0 0 10 4Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/pages",
    label: "Pages",
    section: "Content",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 6a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H7Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/blog",
    label: "Blog",
    section: "Content",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path d="M13.92 3.845a19.361 19.361 0 0 1-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 0 0-.504 7.969 15.974 15.974 0 0 0 1.271 3.341c.397.77 1.342 1 2.01.63l.867-.5c.726-.42.94-1.321.588-2.021-.166-.33-.315-.666-.448-1.004 1.8.358 3.511.964 5.096 1.78A17.964 17.964 0 0 0 15 11c0-2.161-.381-4.234-1.08-6.155Z" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/media",
    label: "Media",
    section: "Content",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/seo",
    label: "SEO",
    section: "Site",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/redirects",
    label: "Redirects",
    section: "Site",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/leads",
    label: "Leads",
    section: "Admin",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/history",
    label: "History",
    section: "Admin",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/studio/dashboard/settings",
    label: "Settings",
    section: "Admin",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const SECTIONS = ["Content", "Site", "Admin"] as const;

export function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/studio/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  async function handleLogout() {
    try { await fetch("/api/cms/login", { method: "DELETE" }); } catch {}
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
    } catch {}
    router.push("/studio");
  }

  return (
    <aside className="flex h-screen w-[220px] flex-none flex-col bg-[#080f20] overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
          <span className="text-sm font-bold text-white">J</span>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-white leading-tight">Jeeni Studio</p>
          <p className="text-[10px] text-white/35 leading-tight">CMS Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3">
        {/* Dashboard (no section header) */}
        {NAV.filter((n) => !n.section).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        {SECTIONS.map((section) => {
          const items = NAV.filter((n) => n.section === section);
          return (
            <div key={section} className="mt-4">
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-white/25">
                {section}
              </p>
              {items.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/5 px-3 py-3 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
          </svg>
          View Site
        </a>
        <a
          href="/?edit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
          </svg>
          Edit Mode
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/50 hover:text-rose-400 hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none">
            <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
        active
          ? "bg-blue-600/20 text-blue-300 font-semibold"
          : "text-white/55 hover:text-white hover:bg-white/5"
      }`}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}
