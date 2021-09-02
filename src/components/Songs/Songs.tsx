import React, { useEffect, useState } from "react";
import styled from "styled-components";
//@ts-ignore
import Card, { item } from "../Card/Card";
import { invoke } from "@tauri-apps/api/tauri";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const H1 = styled.h3`
  margin-bottom: 122px;
  color: #b7b4b9;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto !important;
`;
const PlaceHolder = styled.div`
  margin-top: 100px;
  margin-bottom: 50px;
  width: 100%;
  height: 30px;
  background-color: green;
  flex-direction: column;
`;
function playSong() {
  //@ts-ignore
  if (window.__TAURI__) {
    invoke("play_song").then((message) => console.log(message));
  }
}
const items = [
  {
    subtitle:
      "kfajksdflkjajsk jasdflk jajskdfjk lasldjkf jlkasdljf jkalsdfjlk ajlksdfjlkajskldfjlka jdlkfajkl sdjlfkasjdlkfjlk ajsdlfkj lasdjlk jalksdfjkl laksdfljk asjlkdfj lkasjlkdf jlkaskdf jalsdfkj aksldfj laskdjf klasjdfl",
    title: "yeah",
    id: "13241324",
  },
  {
    subtitle:
      " asdkfljaksdfkjlasdlkjfjkalsdfkljasjlkfkjasdlfjakjsdf lasdfjk asjlkdf jasdflk ajskdf kjlasdlf jaksdflkj asjdf lkasjdf alksfj aklsdfjkla sdjfkla sjdfkl asjdflk asfjklas djfkalsdjf alksdfj alskdfj asdlkf jkasldfj aslkfj aksldf jaslkdf jlk ",
    title: "yeah",
    id: "13241324",
  },
  { subtitle: "this is cool", title: "yeah", id: "13241324" },
  { subtitle: "this is cool", title: "yeah", id: "13241324" },
  { subtitle: "this is cool", title: "yeah", id: "13241324" },
  { subtitle: "this is cool", title: "yeah", id: "13241324" },
  { subtitle: "this is cool", title: "yeah", id: "13241324" },
  { subtitle: "this is cool", title: "yeah", id: "13241324" },
];

const Songs = () => {
  const DISCOGS_URL = "https://api.discogs.com";
  const [items, setItems] = useState<item[]>([]);
  function getWantlistItems() {
    //@ts-ignore
    if (window.__TAURI__) {
      //@ts-ignore
      const invoke = window.__TAURI__.invoke;
      invoke("get_want_list_information", { username: "m1cl" })
        .then((message: any) => {
          setItems(JSON.parse(message));
        })
        .catch(alert);
    }
    // const { REACT_APP_DC_TOKEN } = process.env;
    // fetch(`${DISCOGS_URL}/users/m1cl/wants?token=${REACT_APP_DC_TOKEN}`)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log(res);
    //     const wantList = res.wants;
    //     wantList.map((w: any) => {
    //       fetch(w.resource_url + "?token=" + REACT_APP_DC_TOKEN)
    //         .then((res) => res.json())
    //         .then((res) => {
    //           const {
    //             title: album,
    //             id,
    //             year,
    //             resource_url,
    //           } = res.basic_information;

    //           fetch(resource_url, { mode: "cors" })
    //             .then((res) => res.json())
    //             .then((a) => {
    //               const { artistUri, videos, genres, notes } = a;
    //               const { name: label } = res.labels[0];
    //               const { name: artist } = res.artists[0].name;
    //               console.log(artist);
    //               setItems([
    //                 ...items,
    //                 {
    //                   notes,
    //                   genres,
    //                   album,
    //                   label,
    //                   artist,
    //                   artistUri,
    //                   videos,
    //                   id,
    //                   year,
    //                 },
    //               ]);
    //             });
    //         });
    //     });
    //   })
    //   .catch(console.error);
    // });
  }
  useEffect(() => {
    getWantlistItems();
  }, []);
  return (
    <Container>
      <PlaceHolder>
        <H1>Discogs Wantlist</H1>
      </PlaceHolder>
      <Row>
        <Card items={items} />
      </Row>
      <PlaceHolder>
        <H1>Discogs Wantlist</H1>
      </PlaceHolder>
      <Row>
        <Card items={items} />
      </Row>
      <PlaceHolder>
        <H1>Discogs Wantlist</H1>
      </PlaceHolder>
      <Row>
        <Card items={items} />
      </Row>
    </Container>
  );
};

export default Songs;
