import { PlayList } from "react-modern-audio-player";

export interface PlaylistState {
  playlists: PlayList;
  currentPlaylist: PlayList;
  fetch: any;
}

export type PlaylistType = {
  name: string;
  playlist: string;
  writer: string;
  img: string;
  src: string;
  id: string;
};
