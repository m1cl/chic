import React from "react";
import styled from "styled-components";
import { black, grey, lightblack, white } from "../../colors";
import { borderradius, paddinglg, paddingsm } from "../../spacing";

const Container = styled.div`
  background: ${lightblack};
  padding: ${paddingsm};
  width: 100%;
  z-index: 99;
  position: absolute;
  height: 50px;
  color: ${grey};
  border-bottom: 1px solid ${black};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  background: rgba(41, 42, 48, 1);
  flex: 0 1 auto;
  margin: 12px;
  color: lightgrey;
  border-radius: ${borderradius};
  border: none;
  color: darkgrey;
  padding-left: ${paddinglg};
  outline: none;
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/7022/ios-search.svg);
  background-repeat: no-repeat;
  background-size: 10%;
  background-position: 5px;
  &:hover {
    color: white;
    border: 1px solid blue;
  }
`;

const Content = styled.div`
  flex: 0 1 auto;
`;

const NavBar = () => (
  <Container id="NavBar">
    <Content>hello</Content>
    <SearchInput placeholder="Suchen.."></SearchInput>
  </Container>
);

export default NavBar;
