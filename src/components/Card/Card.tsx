import {AnimateSharedLayout} from "framer-motion";
import {AnimatePresence} from "framer-motion";
import {motion} from "framer-motion";
import React, {FC, MouseEvent, ReactNode, useState} from "react";
import styled from "styled-components";
import {playerRef} from "../../App";
import {H2} from "../Songs/Songs";
import cover from "./album.png";
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
  isExpanded: boolean;
  handleClick: any;
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

const AlbumCover = styled(motion.img) <{isOpen: boolean}>`
  filter: ${(props) =>
    props.isOpen ? "drop-shadow(5px 5px 3px rgba(0,0,0,0.7))" : "opacity(100%)"};
`;

const Container = styled(AnimateSharedLayout)`
  overflow-y: auto;
  width: 100%;
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
export type PlaylistType = {
  name: string;
  writer: string;
  img: string;
  src: string;
  id: string;
};
const ContentContainer = styled(motion.div)``;

const handleClick = (e: MouseEvent<HTMLElement>) => {
  // TODO: some songs are not playing because of string escape issue like quotes
  const songId = e.currentTarget.id;
  console.log("id", songId);
  if (playerRef.current) {
    playerRef.current.src = `${songId}`;
    playerRef.current.play();
  }
};

const Card = ({items}: CardProps) => {
  console.log(items);
  items = items.map((item: any) => {
    item.artist = item.artist?.replace(/['"]+/g, "");
    return item;
  });
  return (
    <Container>
      {items.map((item: any) => (
        <div>
          <Item item={item} />
          <H2 id={item.src} onClick={handleClick}>{item.name}</H2>
        </div>
      ))}
    </Container>
  );
};
const Item: FC<{item: item}> = ({item}) => {
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
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <ItemContainer
      id={item.src}
      layout
      drag
      onClick={handleClick}
      onMouseEnter={fastExpander}
      onMouseLeave={handleMouseLeave}
      animate={{
        width: isOpen ? "220px" : "120px",
        height: isOpen ? "220px" : "120px",
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

const Content: FC<{item: item}> = ({item}) => {
  return (
    <ContentContainer
      layout
      style={{zIndex: 0}}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 1.5}}
      exit={{opacity: 0}}
    >
      <Title className="row">{item.name}</Title>
      <Row className="row">{item.writer}</Row>
      <Row className="row">{item.year}</Row>
      <Row className="row">{item.genres}</Row>
    </ContentContainer>
  );
};

export default Card;
