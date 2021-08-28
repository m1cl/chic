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

const Container = styled(AnimateSharedLayout)``;

const ItemContainer = styled(motion.li)`
  list-style: none;
  margin: 0;
  width: 100px;
  margin-right: 22px;
  height: 100px;
  z-index: 99;
  padding: 12px;
  background-color: rgba(100, 100, 100, 1);
  border-radius: 10px;
  padding: 18px;
  //box-shadow: 0px 10px 22px 1px black;
  margin-bottom: 20px;
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
  items = items.map((i) => {
    Object.values(i).forEach((val) => val.replace(/['"]+/g, ""));
    return i;
  });
  // useEffect(() => {
  //   (async () => {
  //     const unlisten = await listen("play-song", (event) => {
  //       alert(event);
  //       // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
  //       // event.payload is the payload object
  //     });
  //   })();
  // }, []);
  return (
    <Container type="crossfade">
      {items.map((item) => (
        <Item item={item} />
      ))}
    </Container>
  );
};
const Item: FC<{ item: item }> = ({ children, item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [scale, scaleCard] = useCycle(
    {
      sale: 1.0,
    },
    {
      scale: 1.9,
    }
  );

  const [hover, hoverCard] = useCycle(
    {
      sale: 1.0,
    },
    {
      scale: 1.1,
    }
  );

  function handleIsOpen() {
    toggleOpen();
    scaleCard();
  }
  function handleMouseLeave() {
    hoverCard();
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
        width: isOpen ? "220px" : "130px",
        height: isOpen ? "220px" : "130px",
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
