import React, {createRef, RefObject, useState} from "react";
import {useEffect} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import styled from "styled-components";
import Albums from "./components/Albums/Albums";
import Artists from "./components/Artists/Artists";
import Content from "./components/Content/Content";
import NavBar from "./components/NavBar/NavBar";
import Player from "./components/Player/Player";
import {
  AnimatedRoutes,
  RouteTransition,
} from "./components/RouteTransition/RouteTransition";
import {Settings} from "./components/Settings/Settings";
import SideBar from "./components/SideBar/SideBar";
import Songs from "./components/Songs/Songs";
import {useStore} from "./store";
import Modal from 'react-modal';

const Container = styled.div`
background-color: #121212;
display: flex;
height: auto;
overflow-x: auto;
overflow-y: hidden;
margin: 0px;
flex-wrap: wrap;

scrollbar-width: none;
&::-webkit-scrollbar {
display: none;
}
`;
const SwitchContainer = styled.div`
padding-top: 100px;
padding-left: 100px;
margin-bottom: 190px;
overflow-y: auto;
&::-webkit-scrollbar {
display: none;
}
`;
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgba(5, 5, 5, 0.8)",
  },
  Overlay: {
    backgroundColor: "rgba(5, 5, 5, 0.8)",
  }
};

export const playerRef: RefObject<HTMLAudioElement> = createRef();

function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const fetchApi = useStore((state) => state.fetch);
  useEffect(() => {
    fetchApi("playlist");
  }, [fetchApi]);
  return (
    <Router>
      <Container onClick={() => setIsOpen(false)}>
        <Modal
          isOpen={modalIsOpen}
          style={modalStyles}
          contentLabel="Config"
          overlayClassName="Overlay"
        >
          <Settings />
        </Modal>
        <Content>
          <NavBar />
          <SideBar />
          <AnimatedRoutes>
            <SwitchContainer>
              <RouteTransition path="/songs">
                <Songs />
              </RouteTransition>
              <RouteTransition path="/albums">
                <Albums />
              </RouteTransition>
              <RouteTransition path="/artists">
                <Artists />
              </RouteTransition>
              <RouteTransition exact path="/">
                <Songs />
              </RouteTransition>
              <RouteTransition path="/settings">
                <Settings />
              </RouteTransition>
            </SwitchContainer>
          </AnimatedRoutes>
        </Content>
        <Player />
      </Container>
    </Router>
  );
}

export default App;
