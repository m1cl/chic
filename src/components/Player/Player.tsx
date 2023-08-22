import React, { useEffect, useState } from "react";

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
    name: "bdfaf",
    writer: "writer",
    img: "",
    src: "http://localhost:8000/music/bach.wav",
    id: 1,
  },
];
var isFetched = false;

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
    //invoke("get_playlists").then((message) =>
    //console.log(" thie message", message)
    // );
  } else {
    isFetched = true;
    console.log("HOW OFTEN");
    return fetch("http://localhost:3000/api/player/playlists", {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => playList.push(...res) && res)
      .catch((err) => console.error(err));
  }
}

const Player = () => {
  useEffect(() => {
    console.log("LOL");
    if (!isFetched) {
      console.log("How many times ");
      getPlaylist();
    }
  }, []);
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
