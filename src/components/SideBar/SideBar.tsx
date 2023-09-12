import React, {useState} from "react";
import {Link as L} from "react-router-dom";
import styled from "styled-components";
import {black, grey} from "../../colors";
import {useStore} from "../../store";
import {PlaylistType} from "../../types";

const Container = styled.div`
display: flex;
background-color: ${black};
height: 100%;
padding: 80px 15px 80px 15px;
min-width: 240px;
width: 15vw;
max-width: 15vw;
overflow: hidden;
min-height:0;
`;
const Main = styled.div`
background-color: #000000;
display: flex;
justify-content: space-around;
height: 1920;
`;

const MenuContainer = styled.ul`
color: ${grey};
`;
const MenuContent = styled.div`
margin-bottom: 80px;

text-decoration: none;
color: grey;
&:hover {
  cursor: pointer;
  color: white;
}
`;

const PlaylistContent = styled(MenuContent)`
display: flex;
flex-direction: column;
height: 55vh;
margin-bottom: 280px;
background-color: ${black};
overflow-y:scroll;
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
  const [_touchStart, setTouchStart] = useState(null);
  const [_touchEnd, setTouchEnd] = useState(null);
  const [showPlaylistNav, setShowPlaylistNav] = useState(true);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  // const minSwipeDistance = 10;
  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    console.log("LETS GO");
    setTouchStart(e.targetTouches[0].clientX);
  };

  //  const onTouchEnd = () => {
  //    if (!touchStart || !touchEnd) return;
  //    const distance = touchStart - touchEnd;
  //    const isLeftSwipe = distance > minSwipeDistance;
  //    const isRightSwipe = distance < -minSwipeDistance;
  //    if (isLeftSwipe || isRightSwipe) {
  //      console.log("swipe", isLeftSwipe ? "left" : "right");
  //      alert("ADDED to playlist");
  //    }
  //    // add your conditional logic here
  //  };
  const setSelectedPlaylist = useStore((state) => state.setSelectedPlaylist);
  const setCurrentPlaylist = useStore((state) => state.setCurrentPlaylist);
  const playlists = useStore((state) => state.playlists);
  const pl = new Set<PlaylistType>();
  const handleClick = (playlist: PlaylistType) => {
    setCurrentPlaylist(playlist);
    setSelectedPlaylist(playlist);
  };
  let MenuItems: any = [];
  playlists.map((p: any) => pl.add(p.playlist));
  pl.forEach((p) =>
    MenuItems.push(
      <MenuItem
        onTouchStart={onTouchStart}
      >
        <Link
          to="/artists"
          onClick={() => handleClick(p)}
        >
          {p}
        </Link>
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
            <h3 onClick={() => setShowPlaylistNav(!showPlaylistNav)}>
              Playlists{showPlaylistNav ? "" : "..."}
            </h3>
            <PlaylistContent>
              {showPlaylistNav && MenuItems}
            </PlaylistContent>
          </MenuContent>
        </MenuContainer>
      </Container>
    </Main>
  );
};

export default SideBar;
