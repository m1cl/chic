'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Home' },
  { href: '/artists', label: 'Artists' },
  { href: '/playlists', label: 'Playlist' },
];

export default function Sihebar() {
  const pathname = usePathname();
  return (
    <nav className="w-32 sticky overflow-hidden left-0 flex flex-col gap-1 p-2 font-sans text-base font-normal text-gray-700">
      {links.map(({ href, label }) => (
        <Link
          key={label}
          href={href}
          role="button"
          tabIndex={0}
          className={clsx(
            'flex w-full items-center rounded-lg p-3 text-start leading-tight outline-none transition-all hover:bg-blue-50 hover:bg-opacity-80 hover:text-blue-900 focus:bg-blue-50 focus:bg-opacity-80 focus:text-blue-900 active:bg-gray-50 active:bg-opacity-80 active:text-blue-900',
            {
              'bg-sky-100 text-blue-600': pathname === href,
            },
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
