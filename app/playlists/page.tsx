import { getPlaylist } from '../api';
import PlaylistItems from '../components/playlist-items';

export default async function Playlists() {
  const playlists = await getPlaylist();
  return (
    <div className="">
      <PlaylistItems playlists={playlists} />
    </div>
  );
}
