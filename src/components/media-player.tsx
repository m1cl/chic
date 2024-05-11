'use client';
import { BaseDirectory, readDir, readFile } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function MediaPlayer() {
  const [playlists, setPlaylists] = useState<any>([]);
  const [currentSong, setCurrentSong] = useState<any>();
  useEffect(() => {
    readDir('chic', {
      baseDir: BaseDirectory.AppData,
    })
      .then((dirs) => {
        for (const dir of dirs) {
          let playlistItems = [];
          readDir('chic/' + dir.name, { baseDir: BaseDirectory.AppData }).then(
            (files) => {
              for (const file of files) {
                if (file.name.endsWith('.mp3')) {
                  const base_dir = 'chic/' + dir.name + '/';
                  const item = {
                    name: file.name,
                    src: base_dir + file.name,
                    // TODO: check if webp or jpeg
                    img: base_dir + file.name.replace('.mp3', '.jpg'),
                  };
                  playlistItems.push(item);
                }
              }
              setPlaylists((prev: any) => [
                ...prev,
                { name: dir.name, playlistItems },
              ]);
            },
          );
        }
      })
      .catch((err) => {
        console.log('Somethign went wrong', err);
      });
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      const basedir = '/Users/m1cl/Library/Application Support/com.tauri.dev';
      console.log('playlists src', playlists[0]?.playlistItems[0]?.src);
      readFile(basedir + '/' + playlists[0]?.playlistItems[0]?.src).then(
        (file) => {
          console.log('the file', file);
          setCurrentSong(file);
        },
      );
    }
    console.log('currentsong', currentSong);
  }, []);
  return (
    <div className="p-auto fixed bottom-0 mx-auto my-auto flex h-18 w-full justify-center bg-grey-300">
      <AudioPlayer autoPlay src={''} />
    </div>
  );
}
