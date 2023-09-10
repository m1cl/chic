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
import React, { useEffect, useRef, useState } from "react";

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
  const player = useRef();
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

  const allPlaylists = useStore((state) => state.playlists);
  const currentPlaylist = useStore((state) => state.currentPlaylist);
  const [_players, setPlaylists] = useState([]);

  let playList: PlayList[] = [];
  if (currentPlaylist) {
    // TODO: need to be fixed
    playList = [...playlists, ...currentPlaylist];
  } else {
    playList = [...playlists, ...allPlaylists];
  }
  useEffect(() => {
    setPlaylists(playList);
  }, []);
  if (!allPlaylists) return <div />;
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
      >
      </AudioPlayer>
    </MediaPlayer>
  );
};

export default Player;
