import React from "react";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import styled from "styled-components";
import Content from "./components/Content/Content";
import { BrowserRouter as Router } from "react-router-dom";
import Songs from "./components/Songs/Songs";
import Albums from "./components/Albums/Albums";
import Artists from "./components/Artists/Artists";
import {
  AnimatedRoutes,
  RouteTransition,
} from "./components/RouteTransition/RouteTransition";
import Player from "./components/Player/Player";

const Container = styled.div`
  background-color: #121212;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  flex-direction: row;
  margin: 0px;
  flex-wrap: wrap;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const SwitchContainer = styled.div`
  padding-top: 120px;
  padding-left: 100px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
function App() {
  return (
    <Router>
      <Container>
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
            </SwitchContainer>
          </AnimatedRoutes>
        </Content>
        <Player></Player>
      </Container>
    </Router>
  );
}

export default App;
