'use client';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useStore } from '../store';
import { useEffect, useState } from 'react';

export default function MediaPlayer() {
  return (
    <div className="p-auto fixed bottom-0 mx-auto my-auto flex h-18 w-full justify-center bg-grey-300">
      <AudioPlayer
        autoPlay
        src={''}
      // other props here
      />
    </div>
  );
}
