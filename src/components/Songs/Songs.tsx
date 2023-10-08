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
  justify-content: space-between;
flex-wrap: wrap;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: row;
`

export const CardList = styled(Row)`
height: auto;
`;

export const PlaceHolder = styled.div`
  margin-bottom: 10px;
  width: 100%;
  height: 30px;
  flex-direction: column;
`;
export const Container = styled.div`
  width: 30px;
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
  const {items, addItem} = useStore(useCallback((state) => state, []));

  const [_, x] = useState(false);
  function getWantlistItems() {
    //@ts-ignore
    if (window.__TAURI__) {
      //@ts-ignore
      const invoke = window.__TAURI__.invoke;
      // TODO:  REMOVE YOUR USERNAME and make it generic
      invoke("get_want_list_information", {username: "m1cl"})
        .then((message: any) => {
          console.log('discogs', message )
          // addItem(JSON.parse(message));
        })
        .catch(console.error);
    } else {
      fetch("http://localhost:3000/api/discogs/get_want_list/m1cl", {
        mode: "cors",
      })
        .then((res) => res.json())
        .then(addItem)
        .catch((err) => console.error("the error", err));
    }
  }

  const [isExpanded] = useState(false);

  useEffect(() => {
    // getWantlistItems();
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
