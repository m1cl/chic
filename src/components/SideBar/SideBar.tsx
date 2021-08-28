import React from "react";
import { Link as L, BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import { black, grey } from "../../colors";

const Container = styled.div`
  display: flex;
  background-color: ${black};
  height: 100%;
  padding: 80px 15px 80px 15px;
  min-width: 240px;
  max-width: 30vw;
`;
const Main = styled.div`
  background-color: #000000;
  display: flex;
  justify-content: space-around;
`;

const MenuContainer = styled.ul`
  color: ${grey};
`;
const MenuContent = styled.div`
  margin-bottom: 80px;
`;

const MenuItem = styled.li`
  list-style: none;
  margin-left: 22px;
  margin-bottom: 14px;
`;

const Link = styled(L)`
  text-decoration: none;
  color: grey;
  &:hover {
    cursor: pointer;
    color: white;
  }
`;
const SideBar = () => (
  <Main id="sidebar">
    <Container id="sidebar-container">
      <MenuContainer id="menu-container">
        <MenuContent>
          <h3>Your Music</h3>
          <MenuItem>
            <Link to="/songs">Songs</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/albums">Albums</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/artists">Artists</Link>
          </MenuItem>
        </MenuContent>
        <MenuContent>
          <h3>Playlists</h3>
          <MenuItem>
            <Link to="/playlists/:id">Playlist #1</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/playlists/:id">Playlist #2</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/playlists/:id">Playlist #3</Link>
          </MenuItem>
        </MenuContent>
      </MenuContainer>
    </Container>
  </Main>
);

export default SideBar;
