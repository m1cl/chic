import { PlayList } from "react-modern-audio-player";

export interface PlaylistState {
  playlists: PlaylistType[];
  selectedPlaylist: string;
  currentPlaylist: [];
  setCurrentPlaylist: Function;
  setSelectedPlaylist: Function;
  fetch: any;
}

export type PlaylistType = {
  name: string;
  playlist: string;
  writer: string;
  img: string;
  src: string;
  id: number;
};
