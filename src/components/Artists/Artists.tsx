import React, { MouseEvent } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { playerRef } from "../../App";
import { useStore } from "../../store";
import Card from "../Card/Card";

const Container = styled.div`
`;
const Artists = () => {
  const currentPlaylist = useStore((state) => state.selectedPlaylist);
  const playlists = useStore((state) => state.playlists).filter((p) =>
    p.playlist === currentPlaylist
  );
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const songId = e.currentTarget.id;
    if (playerRef.current) {
      playerRef.current.src = songId;
      playerRef.current.play();
    }
  };
  // create a function which adds the song to the playlist
  return (
    <Container>
      <Card items={playlists} />
    </Container>
  );
};

export default withRouter(Artists);
