'use client';

import { usePathname } from 'next/navigation';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide consumer-facing chrome on the admin section.
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
