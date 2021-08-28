import React from "react";

import { invoke } from "@tauri-apps/api/tauri";
import styled from "styled-components";
import play from "./play.png";
// With the Tauri global script, enabled when `tauri.conf.json > build > withGlobalTauri` is set to true:
//
//@ts-ignore
if (window.__TAURI__) {
  //@ts-ignore
  const invi = window.__TAURI__.invoke;
  invoke("my_custom_command").then((message) => console.log(message));
}

function playSong() {
  //@ts-ignore
  if (window.__TAURI__) {
    invoke("play_song").then((message) => console.log(message));
  }
}

const PlayButton = styled.button`
  width: 110px;
  height: 32px;
  display: flex;
  padding: 4px;
  justify-content: center;
  box-shadow: 0px 2px 14px 0.4rem rgba(24, 24, 24, 0.5);
  justify-items: center;
  vertical-align: middle;
  right: 50%;
  bottom: 50%;
  background-color: #181818;
  border: 0px;
  position: absolute;
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
  margin: auto;
  bottom: 0px;
  display: table;
  vertical-align: center;
  text-align: center;
  text-justify: center;
  flex-direction: column;
  position: absolute;
  background-color: #282828;
  width: 100vw;
  height: 100px;
  z-index: 99;
`;

const Player = () => (
  <MediaPlayer>
    <PlayButton onClick={playSong}>
      <img src={play} height="22px" alt="" />
    </PlayButton>
  </MediaPlayer>
);

export default Player;
