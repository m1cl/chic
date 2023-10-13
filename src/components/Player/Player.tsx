import styled from "styled-components";
//import play from "./play.png";
//import next from "./next.png";
import AudioPlayer from "react-modern-audio-player";
import {
  AudioPlayerStateContext,
  //  InterfaceGridTemplateArea,
  PlayerPlacement,
  // PlayList,
  PlayListPlacement,
  ProgressUI,
  VolumeSliderPlacement,
} from "react-modern-audio-player/dist/types/components/AudioPlayer/Context";
import {useStore} from "../../store";
import React, {MutableRefObject, useEffect, useState} from "react";
import {PlaylistState, PlaylistType} from "../../types";
import {playerRef} from "../../App";
import ReactPlayer from "react-player";

// TODO: Create playlist object in the backend for $HOME/.config/chic directory and send it to frontend
const playlists = [];

const PlayerWrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    bottom: 0px;
    background-color: #282828;
    width: 100%;
    height: 100px;
    z-index: 99;
`;

const Buttons = styled.div`
    margin: auto;
    padding: auto;
    background: transparent;
    cursor: pointer;
    border: 0px;
`;

const MediaPlayer = styled.div`
    position: absolute;
    display: flex;
    flex - direction: row;
    bottom: 0px;
    background-color: #282828;
    width: 100vw;
    height: 140px;
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

  const allPlaylists = useStore((state: PlaylistState) => state.playlists);
  const currentPlaylist = useStore((state: PlaylistState) =>
    state.currentPlaylist
  );
  const [_players, setPlaylists] = useState<PlaylistType[]>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const getSongTitle = (song: PlaylistType) => {
    return song.name.split(".mp3")[0].split(" - ")[1];
  };
  const getSongArtist = (song: PlaylistType) => {
    return song.name.split(".mp3")[0].split(" - ")[0];
  };
  const getArtistAndSong = (song: PlaylistType) => {
    return `${getSongArtist(song)} - ${getSongTitle(song)}`;
  };

  const parseSongInformation = (playlistItem: PlaylistType) => {
    if (!playlistItem) return "";
    return playlistItem.name.replace(".mp3", "").slice(0, -12);
  };
  const handleNextSong = (prevNext: string) => {
    if (prevNext) return setCurrentSong(currentSong + 1);
    if ((currentSong) > 0) return setCurrentSong(currentSong - 1);
  };

  let playList: PlaylistType[] = [];
  if (currentPlaylist) {
    // TODO: clean up this
    playList = [...playlists, ...currentPlaylist];
  } else {
    playList = [...playlists, ...allPlaylists];
  }

  useEffect(() => {
    if (playList) {
      setPlaylists(playList);
    }
  }, [isPlaying]);
  if (!allPlaylists) return <div />;

  /** you can get audioPlayerState by props */
  // const load = url => {
  // this.setState({
  // url,
  // played: 0,
  // loaded: 0,
  // pip: false
  // })
  // }

  const handlePlayPause = () => {
    // this.setState({ playing: !this.state.playing })
  };

  const handleStop = () => {
    // this.setState({ url: null, playing: false })
  };

  const handleToggleControls = () => {
    // const url = this.state.url
    // this.setState({
    // controls: !this.state.controls,
    // url: null
    // }, () => this.load(url))
  };

  const handleToggleLight = () => {
    // this.setState({ light: !this.state.light })
  };

  const handleToggleLoop = () => {
    // this.setState({ loop: !this.state.loop })
  };

  const handleVolumeChange = (e) => {
    // this.setState({ volume: parseFloat(e.target.value) })
  };

  const handleToggleMuted = () => {
    // this.setState({ muted: !this.state.muted })
  };

  const handleSetPlaybackRate = (e) => {
    // this.setState({ playbackRate: parseFloat(e.target.value) })
  };

  const handleOnPlaybackRateChange = (speed) => {
    // this.setState({ playbackRate: parseFloat(speed) })
  };

  const handleTogglePIP = () => {
    // this.setState({ pip: !this.state.pip })
  };

  const handlePlay = () => {
    console.log("onPlay");
    // this.setState({ playing: true })
  };

  const handleEnablePIP = () => {
    console.log("onEnablePIP");
    // this.setState({ pip: true })
  };

  const handleDisablePIP = () => {
    console.log("onDisablePIP");
    // this.setState({ pip: false })
  };

  const handlePause = () => {
    console.log("onPause");
    // this.setState({ playing: false })
  };

  const handleSeekMouseDown = (e) => {
    // this.setState({ seeking: true })
  };

  const handleSeekChange = (e) => {
    // this.setState({ played: parseFloat(e.target.value) })
  };

  const handleSeekMouseUp = (e) => {
    // this.setState({ seeking: false })
    // this.player.seekTo(parseFloat(e.target.value))
  };

  const handleProgress = (state) => {
    // console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    // if (!this.state.seeking) {
    // this.setState(state)
    // }
  };

  const handleEnded = () => {
    console.log("onEnded");
    // this.setState({ playing: this.state.loop })
  };

  const handleDuration = (duration) => {
    console.log("onDuration", duration);
    // this.setState({ duration })
  };

  const handleClickFullscreen = () => {
    // screenfull.request(document.querySelector('.react-player'))
  };

  // const renderLoadButton = (url, label) => {
  //   return (
  //     <button onClick={() => this.load(url)}>
  //       {label}
  //     </button>
  //   )
  // }

  const ref = (player) => {
    // this.player = player
  };

  return (
    <PlayerWrapper>
      <ReactPlayer
        // ref={this.ref}
        className="react-player"
        width="100%"
        height="100%"
        url={allPlaylists.length > 0 ? allPlaylists[currentSong].src : ""}
        playing={isPlaying}
        controls={true}
        light={false}
        loop={false}
        playbackRate={1.0}
        volume={0.8}
        muted={false}
        onReady={() => console.log("onReady")}
        onStart={() => console.log("onStart")}
        onPlay={() => setIsPlaying(true)}
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

      <Buttons className="" onClick={handleNextSong}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          version="1.1"
          viewBox="0 0 16 16"
          height="40px"
          width="40px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z">
          </path>
          <path d="M7 8l4-3v6z"></path>
          <path d="M5 5h2v6h-2v-6z"></path>
        </svg>
      </Buttons>
      <marquee
        behavior=""
        direction=""
        style={{fontSize: "42px", color: "cyan"}}
      >
        {allPlaylists ? parseSongInformation(allPlaylists[currentSong]) : ""}
      </marquee>
      <Buttons className="" onClick={() => handleNextSong("next")}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          version="1.1"
          viewBox="0 0 16 16"
          height="40px"
          width="40px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zM8 14.5c3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5 2.91 6.5 6.5 6.5z">
          </path>
          <path d="M9 8l-4-3v6z"></path>
          <path d="M11 5h-2v6h2v-6z"></path>
        </svg>
      </Buttons>
    </PlayerWrapper>
    // <MediaPlayer>
    //   {isPlaying
    //     ? (
    //       <Buttons
    //         className="play-btn"
    //         onClick={() => setIsPlaying(false)}
    //       >
    //         <svg
    //           stroke="currentColor"
    //           fill="currentColor"
    //           stroke-width="0"
    //           viewBox="0 0 24 24"
    //           height="120px"
    //           width="120px"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path fill="none" d="M0 0h24v24H0z"></path>
    //           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z">
    //           </path>
    //         </svg>
    //       </Buttons>
    //     )
    //     : (
    //       <Buttons
    //         className="pause-btn"
    //         onClick={() => setIsPlaying(true)}
    //       >
    //         <svg
    //           stroke="currentColor"
    //           fill="currentColor"
    //           stroke-width="0"
    //           viewBox="0 0 24 24"
    //           height="130px"
    //           width="130px"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path fill="none" d="M0 0h24v24H0z"></path>
    //           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z">
    //           </path>
    //         </svg>
    //       </Buttons>
    //     )}
    //
    //
    //   <Buttons className="">
    //     <svg
    //       stroke="currentColor"
    //       fill="none"
    //       stroke-width="2"
    //       viewBox="0 0 24 24"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //       height="120px"
    //       width="120px"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <desc></desc>
    //       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    //       <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
    //       <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
    //     </svg>
    //   </Buttons>
    //
    //   <Buttons className="">
    //     <svg
    //       stroke="currentColor"
    //       fill="currentColor"
    //       stroke-width="0"
    //       viewBox="0 0 24 24"
    //       height="100%"
    //       width="100%"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path fill="none" d="M0 0h24v24H0z"></path>
    //       <path d="M3 10h11v2H3zM3 6h11v2H3zM3 14h7v2H3zM16 13v8l6-4z"></path>
    //     </svg>
    //   </Buttons>
    //
    // </MediaPlayer>
  );
};

export default Player;
