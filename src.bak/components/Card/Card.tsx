import { AnimateSharedLayout } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import React, { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { H2 } from "../Songs/Songs";
import cover from "./album.png";
import { useStore } from "../../store";
import { parseSongInformation } from "../Player/Player";
import { Draggable } from "../Draggable/Draggable";
// import {emit, listen} from "@tauri-apps/api/event";
// With the Tauri API npm package:

// Invoke the command

export type item = {
  name: ReactNode;
  writer: ReactNode;
  id: string;
  notes?: string;
  genres?: string[];
  album: string;
  label?: string;
  artist: string;
  artistUri: string;
  videos?: any;
  year?: string;
};
type CardProps = {
  items: any;
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

const Container = styled(AnimateSharedLayout)`
  overflow-y: auto;
  width: 120%;
  flex: 1;
  height: 100%;
  cursor: pointer;
  overflow-y: auto;
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

const itemWidth = "240px";
export type PlaylistType = {
  name: string;
  writer: string;
  img: string;
  src: string;
  id: string;
};
const ContentContainer = styled(motion.div)``;

const Card = ({ items }: CardProps) => {
  const setCurrentSongIndex = useStore((state) => state.setCurrentSongIndex);
  const currentTilte = useStore((state) => state.getCurrentTitle)();
  const { isPlaying, setIsPlaying } = useStore();
  items = items.map((item: any) => {
    item.artist = item.artist?.replace(/['"]+/g, "");
    return item;
  });
  //TODO: something odd with id
  const handleClick = (e) => {
    e.preventDefault();

    if (!isPlaying) setIsPlaying(true);
    setCurrentSongIndex(e.target.id);
  };
  // TODO: don t parse if discogs_wantlist
  return (
    <Container>
      {items.map((item: any) => (
        <div id={`container-${item.id}`} key={item.id}>
          <Item item={item} />
          <H2 id={item.id} onClick={handleClick}>
            {item.playlist === "discogs_wantlist"
              ? item.name.replace(".mp3", "")
              : parseSongInformation(item)}
          </H2>
        </div>
      ))}
    </Container>
  );
};
const Item: FC<{ item: PlaylistType }> = ({ item }) => {
  const setCurrentSongIndex = useStore((state) => state.setCurrentSongIndex);
  const { isPlaying, setIsPlaying } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  function handleIsOpen() {
    toggleOpen();
  }
  function handleMouseLeave() {
    isOpen && handleIsOpen();
  }

  function fastExpander() {
    handleIsOpen();
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (!isPlaying) setIsPlaying(true);
    setCurrentSongIndex(e.target.id);
  };
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <ItemContainer
      layout
      drag
      key={`item-container-${item.id}`}
      onMouseEnter={fastExpander}
      onMouseLeave={handleMouseLeave}
      animate={{
        width: isOpen ? "320px" : itemWidth,
        height: isOpen ? "320px" : itemWidth,
        marginRight: "100px",
      }}
    >
      <motion.div className="avatar" layout />

      <AnimatePresence>
        <Draggable id="draggable">
          <AlbumCover
            id={item.id}
            onClick={handleClick}
            animate={{
              width: isOpen ? "40%" : "100%",
              height: isOpen ? "40%" : "100%",
            }}
            isOpen={isOpen}
            src={cover}
            alt=""
          />
        </Draggable>
        {isOpen && <Content item={item} />}
      </AnimatePresence>
    </ItemContainer>
  );
};

const Content: FC<{ item: PlaylistType }> = ({ item }) => {
  return (
    <ContentContainer
      key={item.src}
      layout
      style={{ zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      exit={{ opacity: 0 }}
    >
      <Title className="row">{item.name}</Title>
      <Row className="row">{item.writer}</Row>
      <Row className="row">{item.src}</Row>
      <Row className="row">{item.img}</Row>
    </ContentContainer>
  );
};

export default Card;
