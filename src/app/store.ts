import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPlaylist } from '../api';
import { PlaylistState, PlaylistType } from '../types';
import Fuse from 'fuse.js';
import { createJSONStorage } from 'zustand/middleware';

export const useStore = create(
  persist<PlaylistState>(
    (set, get) => ({
      playlists: [],
      currentPlaylist: [],
      searchResults: '',
      selectedPlaylist: '',
      isPlaying: false,
      getCurrentSong: () =>
        get().currentPlaylist[get().currentSongIndex]?.src ?? null,
      getCurrentTitle: () =>
        get().currentPlaylist[get().currentSongIndex]?.name ?? null,
      currentSongIndex: 0,
      setCurrentSongIndex: (index: number) => set({ currentSongIndex: index }),
      fetchPlaylists: async () => {
        if (get().playlists.length > 0) return;
        const playlists = await getPlaylist();
        set({ playlists });
      },
      setPlaylists: (playlists: PlaylistType[]) => set({ playlists }),
      togglePlaying: () =>
        set((state) => ({ isPlaying: !state.isPlaying })),
      setSearchResults: (results: string) => set({ searchResults: results }),
      setCurrentPlaylist: (playlistName: string) => {
        if (!playlistName) return set({ currentPlaylist: [], currentSongIndex: 0 });
        const playlists = get().playlists;
        const options = { keys: ['playlist', 'src'] };
        const fuse = new Fuse(playlists, options);
        const searchResults = fuse.search(playlistName).map((result) => result.item);
        const indexedPlaylist = searchResults.map((item, index) => ({ ...item, id: index }));
        set({ currentPlaylist: indexedPlaylist, currentSongIndex: 0 });
      },
      setSelectedPlaylist: (name: string) =>
        set({ selectedPlaylist: name, searchResults: '' }),
    }),
    {
      name: 'playlists-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
