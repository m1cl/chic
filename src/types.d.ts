import {PlayList} from "react-modern-audio-player";

export interface PlaylistState {
  playlists: PlaylistType[];
  selectedPlaylist: string;
  currentPlaylist: PlaylistType[];
  setCurrentPlaylist: Function;
  setSelectedPlaylist: Function;
  setSearchResults: Function;
  getCurrentSong: Function;
  searchResults: string;
  currentSongIndex: number;
  setCurrentSongIndex: Function;
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
