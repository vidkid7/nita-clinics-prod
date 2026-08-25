'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** About-page photo management was removed from Site Settings; send admins to Content. */
export default function AboutImagesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/content');
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-neutral-600 text-sm">
      Redirecting…
    </div>
  );
}
