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
import { useStore } from "../../store";
import React, { MutableRefObject, useEffect, useState } from "react";
import { PlaylistState, PlaylistType } from "../../types";
import { playerRef } from "../../App";
import ReactPlayer from 'react-player'

// TODO: Create playlist object in the backend for $HOME/.config/chic directory and send it to frontend
const playlists = [ ];

const PlayerWrapper = styled.div`
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
`
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

  const allPlaylists = useStore((state: PlaylistState) => state.playlists);
  const currentPlaylist = useStore((state: PlaylistState) =>
    state.currentPlaylist
  );
  const [_players, setPlaylists] = useState<PlaylistType[]>();
const [isPlaying, toggleIsPlaying] = useState(false)
const [isLooping, setIsPlaying] = useState(false)

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
  }, []);
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

const  handlePlayPause = () => {
  // this.setState({ playing: !this.state.playing })
}

const handleStop = () => {
  // this.setState({ url: null, playing: false })
}

const handleToggleControls = () => {
    // const url = this.state.url
    // this.setState({
      // controls: !this.state.controls,
      // url: null
    // }, () => this.load(url))
  }

const handleToggleLight = () => {
  // this.setState({ light: !this.state.light })
}

const handleToggleLoop = () => {
  // this.setState({ loop: !this.state.loop })
}

const handleVolumeChange = e => {
  // this.setState({ volume: parseFloat(e.target.value) })
}

const handleToggleMuted = () => {
  // this.setState({ muted: !this.state.muted })
}

const handleSetPlaybackRate = e => {
  // this.setState({ playbackRate: parseFloat(e.target.value) })
}

const handleOnPlaybackRateChange = (speed) => {
  // this.setState({ playbackRate: parseFloat(speed) })
}

const handleTogglePIP = () => {
  // this.setState({ pip: !this.state.pip })
}

const handlePlay = () => {
  console.log('onPlay')
  // this.setState({ playing: true })
}

const handleEnablePIP = () => {
  console.log('onEnablePIP')
  // this.setState({ pip: true })
}

const handleDisablePIP = () => {
  console.log('onDisablePIP')
  // this.setState({ pip: false })
}

const handlePause = () => {
  console.log('onPause')
  // this.setState({ playing: false })
}

const handleSeekMouseDown = e => {
  // this.setState({ seeking: true })
}

const handleSeekChange = e => {
  // this.setState({ played: parseFloat(e.target.value) })
}

const handleSeekMouseUp = e => {
  // this.setState({ seeking: false })
  // this.player.seekTo(parseFloat(e.target.value))
}

const handleProgress = state => {
  // console.log('onProgress', state)
  // We only want to update time slider if we are not currently seeking
  // if (!this.state.seeking) {
    // this.setState(state)
  // }
}

const handleEnded = () => {
  console.log('onEnded')
  // this.setState({ playing: this.state.loop })
}

const handleDuration = (duration) => {
  console.log('onDuration', duration)
  // this.setState({ duration })
}

const handleClickFullscreen = () => {
  // screenfull.request(document.querySelector('.react-player'))
}

// const renderLoadButton = (url, label) => {
//   return (
//     <button onClick={() => this.load(url)}>
//       {label}
//     </button>
//   )
// }

const ref = player => {
  // this.player = player
}

return (
  <PlayerWrapper >
    <ReactPlayer
      // ref={this.ref}
      className='react-player'
      width='100%'
      height='100%'
      url={allPlaylists}
      playing={isPlaying}
      controls={false}
      light={false}
      loop={false}
      playbackRate={1.0}
      volume={0.8}
      muted={false}
      onReady={() => console.log('onReady')}
      onStart={() => console.log('onStart')}
      onPlay={toggleIsPlaying}
      // onEnablePIP={this.handleEnablePIP}
      // onDisablePIP={this.handleDisablePIP}
      onPause={toggleIsPlaying}
      // onBuffer={() => console.log('onBuffer')}
      // onPlaybackRateChange={this.handleOnPlaybackRateChange}
      // onSeek={e => console.log('onSeek', e)}
      // onEnded={this.handleEnded}
      // onError={e => console.log('onError', e)}
      // onProgress={this.handleProgress}
      // // onDuration={this.handleDuration}
      // onPlaybackQualityChange={e => console.log('onPlaybackQualityChange', e)}
    />
  </PlayerWrapper>
);
};

export default Player;
