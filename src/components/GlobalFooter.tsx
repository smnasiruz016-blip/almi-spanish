// Family-wide footer — AlmiWorld Global Nav Spec v1 §3. Data-driven: every family
// product except this site's own is a followed cross-link, strengthening the
// network's SEO (spec §3 note). Product names come from the canonical single source
// (src/lib/nav/family.ts) so they never drift from the header/strip.

import { footerProducts } from "@/lib/nav/family";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "AlmiWorld",
    links: [
      { label: "Home", href: "https://almiworld.com/" },
      { label: "Ebooks", href: "https://almiworld.com/ebooks-2/" },
      { label: "Shamool Foundation", href: "https://shamoolfoundation.com/" },
    ],
  },
  {
    // Every family product except this site's own — from the canonical single source.
    title: "Products",
    links: footerProducts("spanish"),
  },
  {
    title: "Legal & Contact",
    links: [
      { label: "Contact Us", href: "https://almiworld.com/contact-us/" },
      { label: "Refund and Return Policy", href: "https://almiworld.com/refund_returns/" },
      { label: "Privacy Policy", href: "https://almiworld.com/privacy-policy/" },
    ],
  },
];

export function GlobalFooter() {
  return (
    <footer className="bg-[#14110D] text-white/75">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#D4A24C]">{col.title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-white/75 transition-colors hover:text-[#D4A24C]">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/15 pt-6 text-center text-xs text-white/60">
          <p className="mx-auto max-w-2xl">
            25% of AlmiWorld income supports the{" "}
            <a href="https://shamoolfoundation.com/" className="text-white/75 hover:text-[#D4A24C]">Shamool Foundation</a>
            &apos;s free school in Lahore — free education and a daily meal for underprivileged children.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} AlmiWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
