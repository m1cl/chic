import React, {} from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "../../store";
import Card from "../Card/Card";
import { CardList, H1, Main, PlaceHolder } from "../Songs/Songs";

const Container = styled.div`
`;
const Artists = () => {
  const currentPlaylist = useStore((state) => state.selectedPlaylist);
  const playlists = useStore((state) => state.playlists).filter((p) =>
    p.playlist === currentPlaylist
  );
  // create a function which adds the song to the playlist
  return (
    <Main>
      <Container>
        <PlaceHolder>
          <H1>Playlist {currentPlaylist}</H1>
        </PlaceHolder>
        <CardList>
          <Card
            items={playlists}
          />
        </CardList>
      </Container>
    </Main>
  );
};

export default withRouter(Artists);
