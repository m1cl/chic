import Playlist from '@/components/playlist';
import dynamic from 'next/dynamic';

dynamic(() => import('@/components/playlist'), { ssr: false });
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Playlist />
    </main>
  );
}
