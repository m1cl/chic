import React, {useEffect, useState} from "react";

import {invoke} from "@tauri-apps/api/tauri";
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
const playlists = [
  {
    name: "bdfaf",
    writer: "writer",
    img: "",
    src: "",
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
    //@ts-ignore
    const {invoke} = window.__TAURI__;
    invoke("playlist").then((message: any) => {
      console.log("LOl");
      const res = JSON.parse(message);
      playlists.push(...res);
    }).catch((err: any) => console.error("somethign went wrong", err));
  } else {
    isFetched = true;
    return fetch("http://localhost:3000/api/player/playlists", {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => playlists.push(...res) && res)
      .catch((err) => console.error(err));
  }
}

const Player = () => {
  useEffect(() => {
    if (!isFetched) {
      getPlaylist();
      console.log("LOL");
    }
  }, []);
  const [progressType, _] = useState<ProgressUI>("waveform");
  const [volumeSliderPlacement, _setVolumeSliderPlacement] = useState<
    VolumeSliderPlacement
  >();
  const [playerPlacement, _setPlayerPlacement] = useState<PlayerPlacement>(
    "bottom-left",
  );
  const [playListPlacement, _setPlayListPlacement] = useState<
    PlayListPlacement
  >("bottom");
  return (
    <MediaPlayer>
      <AudioPlayer
        playList={playlists}
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
