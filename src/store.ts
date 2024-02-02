import create from "zustand";
import createContext from "zustand/context";
import { persist } from "zustand/middleware";
import { getPlaylist } from "./api";
import { PlaylistState } from "./types";
import Fuse from "fuse.js";

export const Provider = createContext();

export const useStore = create<PlaylistState>(persist(
  (set, get) => ({
    playlists: [],
    currentPlaylist: [],
    searchResults: "",
    selectedPlaylist: "",
    isPlaying: false,
    getCurrentSong: () => {
      if (!get().currentPlaylist[get().currentSongIndex]) return null
      return get().currentPlaylist[get().currentSongIndex].src;
    },
    getCurrentTitle: () => {
      if (!get().currentPlaylist[get().currentSongIndex]) return null
      return get().currentPlaylist[get().currentSongIndex].name
    },
    currentSongIndex: 0,
    setCurrentSongIndex: (currentSongIndex: number) =>
      set({ currentSongIndex }),
    fetch: async (api: string) => {
      if (api === "playlist") {
        // TODO: DEV MODE if is updated
        // if (isUpdated) return
        let isUpdated = get().playlists;
        const playlists = await getPlaylist();
        set({ playlists });
      }
    },
    setIsPlaying: () => set({ isPlaying: !get().isPlaying }),
    setSearchResults: (searchResults: string) => set({ searchResults }),

    setCurrentPlaylist: (playlist: string) => {
      if (playlist) get().setSearchResults(playlist)
      const playlists = get().playlists;
      const options = {
        keys: [
          "playlist",
          "src",
        ],
      };
      // TODO: something odd here
      const currentPlaylist = new Fuse(playlists, options)
        .search(playlist)
        .map((c) => c.item)
        .map((c, i) => {
          c.id = i;
          return c;
        });
      console.log("currentSong is ", currentPlaylist[get().currentSongIndex]);
      if (!playlist) return set({ currentPlaylist: [] });

      return set({ currentPlaylist, currentSongIndex: 0 });
    },
    setSelectedPlaylist: (currentPlaylist: string) =>
      set({ selectedPlaylist: currentPlaylist, searchResults: "" }),
  }),
  {
    name: "playlists-storage", // unique name
    getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
  },
));
