export async function getPlaylist() {
  //@ts-ignore
  if (window.__TAURI__) {
    //@ts-ignore
    const {invoke} = window.__TAURI__;
    return invoke("playlist").then((message: any) => {
      console.log("tauri desktop");
      const res = JSON.parse(message);
      return res;
    }).catch((err: any) => console.error("somethign went wrong", err));
  } else {
    console.log("web app ");
    return fetch("http://localhost:3000/api/player/playlists", {
      mode: "cors",
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));
  }
}
