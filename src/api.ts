import { invoke } from '@tauri-apps/api/core';

export function getPlaylist(): Promise<string> {
  return invoke('get_playlists');
}
