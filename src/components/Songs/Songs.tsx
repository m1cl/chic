import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
//@ts-ignore
import Card, {item} from "../Card/Card";
import create from "zustand";
import {persist} from "zustand/middleware";

export const Main = styled.div`
  display: table-row;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const H1 = styled.h3`
  color: #b7b4b9;
`;

export const H2 = styled.h5`
width: 150px;
  color: #b7b4b9;
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CardList = styled(Row)``;

export const PlaceHolder = styled.div`
  margin-bottom: 10px;
  width: 100%;
  height: 30px;
  flex-direction: column;
`;
export const Container = styled.div`
  width: 80%;
  margin-bottom: 84px;
`;

interface SongsZustand {
  items: item[];
  addItem: (item: item[]) => void;
}

// TODO: make store global
const useStore = create<SongsZustand>(
  persist(
    (set, get) => ({
      addItem: (item: item[]) => {
        console.log(item);
        set(() => ({
          items: [...get().items, ...item],
        }));
      },
      items: [],
    }),
    {
      name: "songs-storage",
      getStorage: () => sessionStorage,
    },
  ),
);

const Songs = () => {
  const {items} = useStore(useCallback((state) => state, []));

  const [isExpanded] = useState(false);

  useEffect(() => {
    //getWantlistItems();
  }, []);

  // TODO: make cards expand when switch to another card fast
  if (items.length) {
    return (
      <Main>
        <Container>
          <PlaceHolder>
            <H1>Discogs Wantlist</H1>
          </PlaceHolder>
          <Row>
            <Card isExpanded={isExpanded} items={items.slice(0, 6)} />
          </Row>
        </Container>

        <Container>
          <PlaceHolder>
            <H1>Discogs Wantlist</H1>
          </PlaceHolder>
          <CardList>
            <Card isExpanded={isExpanded} items={items.slice(1, 3)} />
          </CardList>
        </Container>
        <Container>
          <PlaceHolder>
            <H1>Discogs Wantlist</H1>
          </PlaceHolder>
          <CardList>
            <Card isExpanded={isExpanded} items={items.slice(0, 1)} />
          </CardList>
        </Container>
      </Main>
    );
  }
  return <div>No data here yet</div>;
};

export default Songs;
