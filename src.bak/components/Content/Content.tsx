import React, { FC } from "react";
import styled from "styled-components";
import { grey } from "../../colors";

const Container = styled.div`
  padding-bottom: 200px;
  display: flex;
  overflow-wrap: break-word;
  overflow-x: hidden;
  color: blue;
  height: 100vh;
  width: 100vw;
`;
const Content: FC = ({ children }) => <Container>{children}</Container>;

export default Content;
