import Link from "next/link";
import NavItems from "./nav-items";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Sidebar() {
  return (
    <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-gray-700">
      {links.map(({ href, label }) => (
        <Link
          key={label}
          href={href}
          role="button"
          tabIndex={0}
          className="flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-blue-50 hover:bg-opacity-80 hover:text-blue-900 focus:bg-blue-50 focus:bg-opacity-80 focus:text-blue-900 active:bg-gray-50 active:bg-opacity-80 active:text-blue-900"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
