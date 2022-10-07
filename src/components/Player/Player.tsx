import React, { useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
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
    img: "image.jpg",
    src: "./aufgehts.wav",
    id: 1,
  },
];
// With the Tauri global script, enabled when `tauri.conf.json > build > withGlobalTauri` is set to true:
//

function playSong() {
  //@ts-ignore
  if (window.__TAURI__) {
    invoke("play_song").then((message) => console.log(message));
  } else {
    fetch("http://localhost:3000/api/player/play_song", {
      mode: "cors",
    });
  }
}

const PlayButton = styled.button`
  width: 110px;
  height: 32px;
  display: flex;
  margin-right: 22px;
  padding: 5px;
  margin-top: 12px;
  justify-content: center;
  box-shadow: 0px 2px 14px 0.4rem rgba(24, 24, 24, 0.5);
  justify-items: center;
  vertical-align: middle;
  background-color: #181818;
  border: 0px;
  transform: translate(50%, 50%);
  &:hover {
    background-color: rgba(24, 24, 24, 0.3);
    & > img {
      color: #182828;
    }
  }
  &:active {
    margin: 2px;
  }
`;
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
const Previous = styled.img`
  transform: rotate(180deg);
`;

// const Player = () => (
//   <MediaPlayer>
//     <PlayButton>
//       <Previous src={next} height="22px" alt="" />
//     </PlayButton>
//     <PlayButton onClick={playSong}>
//       <img src={play} height="22px" alt="" />
//     </PlayButton>
//     <PlayButton>
//       <img src={next} height="22px" alt="" />
//     </PlayButton>
//   </MediaPlayer>
// );
const Player = () => {
  const [progressType, setProgressType] = useState<ProgressUI>("waveform");
  const [volumeSliderPlacement, setVolumeSliderPlacement] =
    useState<VolumeSliderPlacement>();
  const [playerPlacement, setPlayerPlacement] =
    useState<PlayerPlacement>("bottom-left");
  const [interfacePlacement, setInterfacePlacement] =
    useState<InterfaceGridTemplateArea>();
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
          interface: {
            templateArea: interfacePlacement,
          },
          playList: playListPlacement,
          volumeSlider: volumeSliderPlacement,
        }}
      />
    </MediaPlayer>
  );
};

export default Player;
