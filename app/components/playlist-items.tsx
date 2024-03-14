'use client';
import Image from 'next/image';

import { PlaylistType } from '../types';
import { useStore } from '../store';

export default function PlaylistItems({
  playlists,
}: {
  playlists: PlaylistType[];
}) {
  const {
    currentPlaylist,
    getCurrentSong,
    setPlaylists,
    getCurrentTitle,
    setSelectedPlaylist,
  } = useStore((state) => state);
  // setPlaylists(playlists);
  return (
    <div className="w-24 h-24">
      {playlists &&
        playlists.map((item: PlaylistType, i: number) => (
          <button
            key={item.name + '_' + i}
            className="font font-bold text-red-500 border-4 border-green-200"
          >
            {item.name}
          </button>
        ))}
    </div>
  );
}
