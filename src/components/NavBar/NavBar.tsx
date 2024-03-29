import React, { FormEvent } from "react";
import { useState } from "react";
import styled from "styled-components";
import { black, grey, lightblack } from "../../colors";
import { borderradius, paddinglg, paddingsm } from "../../spacing";
import { useStore } from "../../store";
import { Link } from "../SideBar/SideBar";

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

const NavBar = () => {
  const setCurrentPlaylist = useStore((state) => state.setCurrentPlaylist);
  const [searchValue, setSearchValue] = useState("");
  const handleOnChange = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPlaylist(searchValue);
  };
  const handleSettingsClick = () => {};
  return (
    <Container id="NavBar">
      <Link to="/settings">
        <Content>chic</Content>
      </Link>
      <form onSubmit={handleOnChange}>
        <SearchInput
          placeholder="Suchen.."
          onChange={(e) => setSearchValue(e.target.value)}
        ></SearchInput>
      </form>
    </Container>
  );
};

export default NavBar;
