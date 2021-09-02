import React, { useEffect, useState } from "react";
import styled from "styled-components";
//@ts-ignore
import Card, { item } from "../Card/Card";
import { invoke } from "@tauri-apps/api/tauri";
import create from "zustand";
import { persist } from "zustand/middleware";

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const H1 = styled.h3`
  color: #b7b4b9;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto !important;
`;
const PlaceHolder = styled.div`
  margin-bottom: 20px;
  width: 100%;
  height: 30px;
  flex-direction: column;
`;
const Container = styled.div`
  margin-bottom: 84px;
`;

const Hr = styled.hr`
  margin-top: 42px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

interface SongsZustand {
  items: item[];
  addItem: (item: item[]) => void;
}

const useStore = create<SongsZustand>(
  persist(
    (set, get) => ({
      addItem: (item: item[]) => {
        alert(item);
        set((state) => ({
          items: [...get().items, ...item],
        }));
      },
      items: [],
    }),
    {
      name: "songs-storage",
      getStorage: () => sessionStorage,
    }
  )
);

const Songs = () => {
  const { items, addItem } = useStore((state) => state);

  function getWantlistItems() {
    //@ts-ignore
    if (window.__TAURI__) {
      //@ts-ignore
      const invoke = window.__TAURI__.invoke;
      invoke("get_want_list_information", { username: "m1cl" })
        .then((message: any) => {
          addItem(JSON.parse(message));
        })
        .catch(alert);
    }
  }
  useEffect(() => {
    getWantlistItems();
  }, []);

  if (items.length) {
    return (
      <Main>
        <Container>
          <PlaceHolder>
            <H1>Discogs Wantlist</H1>
          </PlaceHolder>
          <Row>
            <Card items={items} />
          </Row>
        </Container>

        <Container>
          <PlaceHolder>
            <H1>Discogs Wantlist</H1>
          </PlaceHolder>
          <Row>
            <Card items={items} />
          </Row>
        </Container>
        <Container>
          <PlaceHolder>
            <H1>Discogs Wantlist</H1>
          </PlaceHolder>
          <Row>
            <Card items={items} />
          </Row>
        </Container>
      </Main>
    );
  }
  return <div> No data here yet</div>;
};

export default Songs;
