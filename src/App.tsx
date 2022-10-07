import { BrowserRouter as Router } from "react-router-dom";
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
import SideBar from "./components/SideBar/SideBar";
import Songs from "./components/Songs/Songs";

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
  padding-top: 100px;
  padding-left: 100px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
function App() {
  console.log("hello");
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
