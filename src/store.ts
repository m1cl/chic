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
    selectedPlaylist: "",
    fetch: async () => {
      let isUpdated = get().playlists;
      const playlists = await getPlaylist();
      set({ playlists });
    },
    setCurrentPlaylist: (playlist: string) => {
      const playlists = get().playlists;
      const options = {
        keys: [
          "playlist",
          "src",
        ],
      };
      const currentPlaylist = new Fuse(playlists, options)
        .search(playlist)
        .map((c) => c.item)
        .map((c, i) => {
          c.id = i + 1;
          return c;
        });
      if (!playlist) return set({ currentPlaylist: [] });

      return set({ currentPlaylist });
    },
    setSelectedPlaylist: (currentPlaylist: string) =>
      set({ selectedPlaylist: currentPlaylist }),
  }),
  {
    name: "playlists-storage", // unique name
    getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
  },
));
