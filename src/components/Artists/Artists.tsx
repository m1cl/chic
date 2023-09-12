import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { playerRef } from "../../App";
import { useStore } from "../../store";

const Container = styled.div`
`;
const Artists = () => {
  const currentPlaylist = useStore((state) => state.selectedPlaylist);
  const playlists = useStore((state) => state.playlists).filter((p) =>
    p.playlist === currentPlaylist
  );
  const handleClick = (e) => {
    const songId = e.target.id;
    console.log("songid", songId);
    playerRef.current.src = songId;
    playerRef.current.play();
  };
  return (
    <Container>
      {playlists.map((p) => (
        <div id={p.src} onClick={handleClick}>
          {p.name}
        </div>
      ))}
    </Container>
  );
};

export default withRouter(Artists);
