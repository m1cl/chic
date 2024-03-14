import { invoke } from '@tauri-apps/api/tauri';

export async function getPlaylist() {
  const data = await fetch('http://localhost:8000/api/playlists');
  return await data.json();
}
