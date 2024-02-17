const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
export default function NavItems() {
  return (
    <>
      {links.map(({ href, label }) => (
        <a className="flex" key={href} href={href}>
          {label}
        </a>
      ))}
    </>
  );
}
