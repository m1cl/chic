import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "../../store";

const Container = styled.div`
`;
const Artists = () => {
  const currentPlaylist = useStore((state) => state.currentPlaylist);
  const playlists = useStore((state) => state.playlists).filter((p) =>
    p.playlist === currentPlaylist
  );
  return (
    <Container>
      {playlists.map((p) => (
        <div>
          {p.name}
        </div>
      ))}
    </Container>
  );
};

export default withRouter(Artists);
