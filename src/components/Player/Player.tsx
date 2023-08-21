import React, { useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import styled from "styled-components";
//import play from "./play.png";
//import next from "./next.png";
import AudioPlayer from "react-modern-audio-player";
import {
  //  InterfaceGridTemplateArea,
  PlayerPlacement,
  // PlayList,
  PlayListPlacement,
  ProgressUI,
  VolumeSliderPlacement,
} from "react-modern-audio-player/dist/types/components/AudioPlayer/Context";

// TODO: Create playlist object in the backend for $HOME/.config/chic directory and send it to frontend
const playList = [
  {
    name: "bach",
    writer: "writer",
    img: "",
    src: "http://localhost:8000/music/bach.wav",
    id: 1,
  },
];

const MediaPlayer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
  flex-wrap: nowrap;
  bottom: 0px;
  vertical-align: center;
  background-color: #282828;
  width: 100vw;
  height: 100px;
  z-index: 99;
`;

async function getPlaylist() {
  //@ts-ignore
  if (window.__TAURI__) {
    invoke("playlist_items").then((message) =>
      console.log(" thie message", message)
    );
  } else {
    return fetch("http://localhost:3000/api/player/playlist_items", {
      mode: "cors",
    });
  }
}

function playSong() {
  //@ts-ignore
  if (window.__TAURI__) {
    invoke("play_song").then((message) => console.log(message));
  } else {
    fetch("http://localhost:3000/api/player/play_song", {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }
}

const Player = () => {
  getPlaylist()
    .then((res) => res?.json())
    .then((res) => {
      res.map((r: any) => {
        console.log("the res", res);

        console.log(r.src.split("/").pop());
        playList.push(r);
        return res;
      });
    });

  const [progressType, _] = useState<ProgressUI>("waveform");
  const [volumeSliderPlacement, _setVolumeSliderPlacement] =
    useState<VolumeSliderPlacement>();
  const [playerPlacement, _setPlayerPlacement] =
    useState<PlayerPlacement>("bottom-left");
  const [playListPlacement, _setPlayListPlacement] =
    useState<PlayListPlacement>("bottom");
  return (
    <MediaPlayer>
      <AudioPlayer
        playList={playList}
        activeUI={{
          all: true,
          progress: progressType,
        }}
        placement={{
          player: playerPlacement,
          playList: playListPlacement,
          volumeSlider: volumeSliderPlacement,
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
