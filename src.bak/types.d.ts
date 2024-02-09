import { PlayList } from "react-modern-audio-player";

export interface PlaylistState {
  playlists: PlaylistType[];
  selectedPlaylist: string;
  currentPlaylist: PlaylistType[];
  setCurrentPlaylist: Function;
  setSelectedPlaylist: Function;
  setSearchResults: Function;
  getCurrentTitle: Function;
  getCurrentSong: Function;
  searchResults: string;
  isPlaying: boolean;
  setIsPlaying: Function;
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
