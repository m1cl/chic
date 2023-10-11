import React, {} from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "../../store";
import Card from "../Card/Card";
import { CardList, H1, Main, PlaceHolder } from "../Songs/Songs";

const Container = styled.div`
`;
const Artists = () => {
  const currentPlaylistTitle = useStore((state) => state.selectedPlaylist);
  const playlists = useStore((state) => state.playlists).filter((p) =>
    p.playlist === currentPlaylistTitle
  );
  const currentPlaylist = useStore((state) => state.currentPlaylist)
  const searchResults = useStore((state) => state.searchResults)
  // create a function which adds the song to the playlist
  return (
    <Main>
      <Container>
        <PlaceHolder>
          <H1> {searchResults ? `🔎 ${ searchResults }` : `Playlist ${currentPlaylistTitle}`}</H1>
        </PlaceHolder>
        <CardList>
          <Card
            items={currentPlaylist ? currentPlaylist : playlists}
          />
        </CardList>
      </Container>
    </Main>
  );
};

export default withRouter(Artists);
