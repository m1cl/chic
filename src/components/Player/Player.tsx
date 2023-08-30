import React, { useState } from "react";

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
import { useStore } from "../../store";

// TODO: Create playlist object in the backend for $HOME/.config/chic directory and send it to frontend
const playlists = [
  {
    name: "",
    writer: "",
    img: "",
    src: "",
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

const Player = () => {
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

  const fetchedPLaylists = useStore((state) => state.playlists);
  playlists.push(...fetchedPLaylists);
  if (!fetchedPLaylists) return <div />;
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
