import React from "react";
import { BrowserRouter as Router, Link as L } from "react-router-dom";
import styled from "styled-components";
import { black, grey } from "../../colors";
import { useStore } from "../../store";

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
const SideBar = () => {
  const playlists = useStore((state) => state.playlists);
  const pl = new Set();
  let MenuItems = [];
  playlists.map((p) => pl.add(p.playlist));
  pl.forEach((p) =>
    MenuItems.push(
      <MenuItem>
        <Link to="/playlists/:id">{p}</Link>
      </MenuItem>,
    )
  );
  return (
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
            {MenuItems.map((m) => m)}
          </MenuContent>
        </MenuContainer>
      </Container>
    </Main>
  );
};

export default SideBar;
