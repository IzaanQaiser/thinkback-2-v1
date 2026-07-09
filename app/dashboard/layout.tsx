import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "Inbox" },
  { href: "/dashboard/search", label: "Search" },
  { href: "/dashboard/reminders", label: "Reminders" },
  { href: "/dashboard/ask", label: "Ask" },
  { href: "/dashboard/brag-sheet", label: "Brag Sheet" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#18191b]">
      <header className="border-b border-[#d7dbe0] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#5d6b7a]">
              Thinkback
            </p>
            <h1 className="text-2xl font-semibold tracking-normal text-[#18191b]">
              Memory inbox
            </h1>
          </div>
          <nav aria-label="Dashboard navigation" className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Link
                className="rounded-lg border border-[#d7dbe0] bg-white px-3 py-2 text-sm font-medium text-[#2c333a] transition hover:border-[#2663eb] hover:text-[#1746a2]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
