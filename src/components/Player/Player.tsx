import React, {useState} from "react";

import {invoke} from "@tauri-apps/api/tauri";
import styled from "styled-components";
//import play from "./play.png";
//import next from "./next.png";
import AudioPlayer from "react-modern-audio-player";
import {
  InterfaceGridTemplateArea,
  PlayerPlacement,
  PlayListPlacement,
  ProgressUI,
  VolumeSliderPlacement,
} from "react-modern-audio-player/dist/types/components/AudioPlayer/Context";

const playList = [
  {
    name: "aufgehts",
    writer: "writer",
    img: "",
    src: "./aufgehts.wav",
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

//function playSong() {
//  //@ts-ignore
//  if (window.__TAURI__) {
//    invoke("play_song").then((message) => console.log(message));
//  } else {
//    fetch("http://localhost:3000/api/player/play_song", {
//      mode: "cors",
//    });
//  }
//}

const Player = () => {
  const [progressType, setProgressType] = useState<ProgressUI>("waveform");
  const [volumeSliderPlacement, setVolumeSliderPlacement] =
    useState<VolumeSliderPlacement>();
  const [playerPlacement, setPlayerPlacement] =
    useState<PlayerPlacement>("bottom-left");
  const [playListPlacement, setPlayListPlacement] =
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
