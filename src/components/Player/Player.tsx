import styled from "styled-components";
//import play from "./play.png";
//import next from "./next.png";
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
import { PlaylistState, PlaylistType } from "../../types";
import ReactPlayer from "react-player";
import Button, { ButtonType } from "../Button/Button";

// TODO: Create playlist object in the backend for $HOME/.config/chic directory and send it to frontend
//
export const parseSongInformation = (playlistItem: PlaylistType) => {
  if (!playlistItem || !playlistItem.name) return "";
  return playlistItem.name.replace(".mp3", "");
};

const PlayerWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 0px;
  background-color: #282828;
  width: 100%;
  height: 150px;
`;

const MediaPlayer = styled.div`
  position: absolute;
  margin-right: 120px;
  margin-bottom: 60px;
  margin-top: 62px;
  display: flex;
  background-color: rgba(0, 0, 0, 0);
`;
// https://codepen.io/G-Mariem/pen/gOvBjMP
const Center = styled.div`
  transform: prespective(1000px) translate(-50%, -50%);
  transform: skewY(15deg);
  transition: 0.5s;
  transform: translate(-50%, -50%);
  margin: 30px;
  margin-left: 120px;
  width: 70vw;
  text-transform: uppercase;
  font-size: 2em;
  color: #fff;
  transform-style: preserve-3d;
  transition: 0.8s;
  // &:hover{
  //       transform:prespective(100px) translate(-30%,-30%);
  //   transform:skewY(0deg);
  // }
`;

const Marquee = styled.marquee`
  transition: 0.5s;
  behavior: slide;
  width: 37vw;
  font-size: 1em;
  color: #fff;
`;

const Player = () => {
  const ref = useRef(null);
  const [progressType, _] = useState<ProgressUI>("waveform");
  const [volumeSliderPlacement, _setVolumeSliderPlacement] =
    useState<VolumeSliderPlacement>();
  const [playerPlacement, _setPlayerPlacement] =
    useState<PlayerPlacement>("bottom-left");
  const [playListPlacement, _setPlayListPlacement] =
    useState<PlayListPlacement>("bottom");

  const allPlaylists = useStore((state: PlaylistState) => state.playlists);
  const currentPlaylist = useStore(
    (state: PlaylistState) => state.currentPlaylist,
  );
  const setCurrentPlaylist = useStore(
    (state: PlaylistState) => state.setCurrentPlaylist,
  );
  const setCurrentSongIndex = useStore(
    (state: PlaylistState) => state.setCurrentSongIndex,
  );
  const currentSongIndex = useStore(
    (state: PlaylistState) => state.currentSongIndex,
  );

  const isPlaying = useStore((state: PlaylistState) => state.isPlaying);
  const setIsPlaying = useStore((state: PlaylistState) => state.setIsPlaying);

  const [_players, setPlaylists] = useState<PlaylistType[]>();
  const [isLooping, setIsLooping] = useState(false);
  const [url, setUrl] = useState("");

  const handleNextSong = (prevNext: string) => {
    if (prevNext) return setCurrentSongIndex(currentSongIndex + 1);
    if (currentSongIndex > 0) return setCurrentSongIndex(currentSongIndex - 1);
  };

  useEffect(() => {
    if (allPlaylists) {
      if (!currentPlaylist) {
        console.log("set current playlist");
        setCurrentPlaylist(allPlaylists);
      }
    }
  }, [currentPlaylist, currentSongIndex]);
  if (ref) {
    console.log(ref.current);
  }

  if (!currentPlaylist) return <div />;

  // TODO: write an data strucutre or algo like:
  // put currently playing song to the start of the playlist and all songs before it to the end
  return (
    <PlayerWrapper>
      <ReactPlayer
        // ref={this.ref}
        className="react-player"
        ref={ref}
        width="100%"
        height="100%"
        url={
          currentPlaylist[currentSongIndex]
            ? currentPlaylist[currentSongIndex].src
            : ""
        }
        playing={isPlaying}
        controls={true}
        light={false}
        loop={false}
        playbackRate={1.0}
        volume={0.8}
        muted={false}
        onReady={() => console.log("onReady")}
        onStart={() => console.log("onStart")}
        onPlay={() => console.log("is playing")}
        // ENDED is the solution
        onEnded={() => handleNextSong("next")}
        onBufferEnd={() => console.log("buffer ends")}
        // onEnablePIP={this.handleEnablePIP}
        // onDisablePIP={this.handleDisablePIP}
        onPause={() => console.log("onPause")}
        // onBuffer={() => console.log('onBuffer')}
        // onPlaybackRateChange={this.handleOnPlaybackRateChange}
        // onSeek={e => console.log('onSeek', e)}
        // onEnded={this.handleEnded}
        // onError={e => console.log('onError', e)}
        // onProgress={this.handleProgress}
        // // onDuration={this.handleDuration}
        // onPlaybackQualityChange={e => console.log('onPlaybackQualityChange', e)}
      />

      <Marquee>
        <Center>
          {parseSongInformation(currentPlaylist[currentSongIndex])}
        </Center>
      </Marquee>

      <MediaPlayer>
        <Button buttonType={ButtonType.PREV} />
        <Button buttonType={ButtonType.START} />
        <Button buttonType={ButtonType.NEXT} />
      </MediaPlayer>
    </PlayerWrapper>
  );
};

export default Player;
