import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  background-color: blue;
`;
const Artists = () => {
  return <Container>Artists Component</Container>;
};

export default withRouter(Artists);
