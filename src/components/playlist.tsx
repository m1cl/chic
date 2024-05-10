'use client';
import { invoke } from '@tauri-apps/api/core';

async function getPlaylist() {
  invoke('get_playlists');
}

export default function Playlist() {
  getPlaylist()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  return <div></div>;
}
