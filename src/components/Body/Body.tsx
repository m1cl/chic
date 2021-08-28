import React, { FC } from "react";
import styled from "styled-components";

const Content = styled.div`
  background-color: pink;
  position: relative;
  overflow-x: auto;
  width: 100%;
`;

const Body: FC = ({ children }) => <Content id="body">{children}</Content>;

export default Body;
