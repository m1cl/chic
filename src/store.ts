import create from "zustand";
import createContext from "zustand/context";
import { persist } from "zustand/middleware";
import { getPlaylist } from "./api";
import { PlaylistState } from "./types";

export const Provider = createContext();

export const useStore = create<PlaylistState>(persist(
  (set) => ({
    playlists: [],
    currentPlaylist: [],
    fetch: async () => {
      const playlists = await getPlaylist();
      set({ playlists });
    },
  }),
  {
    name: "playlists-storage", // unique name
    getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
  },
));
