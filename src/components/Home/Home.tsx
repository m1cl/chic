import React, { FC } from "react";
import styled from "styled-components";
import Body from "../Body/Body";

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80vw;
  padding: 100px  50px; 100px 50px;
  background-color: #151515;
  color: green !important;
`;

const Home: FC = ({ children }) => (
  <Content id="home">
    <Body></Body>
  </Content>
);

export default Home;
