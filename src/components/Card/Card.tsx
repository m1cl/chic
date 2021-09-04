import { AnimateSharedLayout, useCycle } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import cover from "./album.png";
// import {emit, listen} from "@tauri-apps/api/event";
// With the Tauri API npm package:

// Invoke the command

export type item = {
  id: string;
  notes: string;
  genres: string[];
  album: string;
  label: string;
  artist: string;
  artistUri: string;
  videos: any;
  year: string;
};
type CardProps = {
  items: item[];
};

// .saturate { filter: saturate(3); }
// .grayscale { filter: grayscale(100%); }
// .contrast { filter: contrast(160%); }
// .brightness { filter: brightness(0.25); }
// .blur { filter: blur(3px); }
// .invert { filter: invert(100%); }
// .sepia { filter: sepia(100%); }
// .huerotate { filter: hue-rotate(180deg); }
// .rss.opacity { filter: opacity(50%); }

const Title = styled.h3`
  color: white;
`;

const AlbumCover = styled(motion.img)<{ isOpen: boolean }>`
  filter: ${(props) =>
    props.isOpen
      ? "drop-shadow(5px 5px 3px rgba(0,0,0,0.7))"
      : "opacity(100%)"};
`;
const hoverAnimation = keyframes`
 0% { height: 100px; width: 100px; }
 30% { height: 110px; width: 110px}
 40% { height: 115px; width: 115px }
 100% { height: 125px; width: 125px }
`;

const Container = styled(AnimateSharedLayout)`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow-y;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ItemContainer = styled(motion.li)`
  list-style: none;
  margin: 0;
  width: 100%;
  height: 100%;
  margin-right: 8px;
  z-index: 99;
  padding: 4px;
  background-color: rgba(100, 100, 100, 1);
  border-radius: 10px;
  padding: 18px;
  //box-shadow: 0px 10px 22px 1px black;
  margin-bottom: 8px;
  overflow-y: auto;
  cursor: pointer;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Row = styled.div`
  color: white;
  font-size: 16px;
  width: 100%;
  border-radius: 10px;
  margin-top: 12px;
`;

const ContentContainer = styled(motion.div)``;

const Card = ({ items }: CardProps) => {
  items = items.map((item) => {
    item.artist = item.artist?.replace(/['"]+/g, "");
    return item;
  });
  return (
    <Container>
      {items.map((item) => (
        <Item item={item} />
      ))}
    </Container>
  );
};
const Item: FC<{ item: item }> = ({ children, item }) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleIsOpen() {
    toggleOpen();
  }
  function handleMouseLeave() {
    isOpen && handleIsOpen();
  }
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <ItemContainer
      layout
      drag
      onClick={handleIsOpen}
      onMouseLeave={handleMouseLeave}
      animate={{
        width: isOpen ? "220px" : "80px",
        height: isOpen ? "220px" : "80px",
        marginRight: "100px",
      }}
    >
      <motion.div className="avatar" layout />

      <AnimatePresence>
        <AlbumCover
          animate={{
            width: isOpen ? "40%" : "100%",
            height: isOpen ? "40%" : "100%",
          }}
          isOpen={isOpen}
          src={cover}
          alt=""
        />
        {isOpen && <Content item={item} />}
      </AnimatePresence>
    </ItemContainer>
  );
};

const Content: FC<{ item: item }> = ({ item }) => {
  return (
    <ContentContainer
      layout
      style={{ zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      exit={{ opacity: 0 }}
    >
      <Title className="row">{item.artist}</Title>
      <Row className="row">{item.album}</Row>
      <Row className="row">{item.year}</Row>
      <Row className="row">{item.genres}</Row>
    </ContentContainer>
  );
};

export default Card;
