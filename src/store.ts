import create from "zustand";
import createContext from "zustand/context";
import {persist} from "zustand/middleware";
import {getPlaylist} from "./api";
import {PlaylistState} from "./types";

export const Provider = createContext();

export const useStore = create<PlaylistState>(persist(
  (set, get) => ({
    playlists: [],
    currentPlaylist: "",
    fetch: async () => {
      let isUpdated = get().playlists;
      if (!isUpdated) {
        const playlists = await getPlaylist();
        set({playlists});
      }
    },
    setCurrentPlaylist: (currentPlaylist: string) => set({currentPlaylist}),
  }),
  {
    name: "playlists-storage", // unique name
    getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
  },
));
