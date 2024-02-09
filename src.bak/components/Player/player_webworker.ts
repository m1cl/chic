/* eslint-disable no-restricted-globals */
// websocket-worker.ts
const WEBSOCKET_URL = "ws://localhost:9002";

function createSocketInstance() {
  let socket = new WebSocket(WEBSOCKET_URL);

  return socket;
}
function socketManagement() {
  if (socketInstance) {
    socketInstance.onopen = function (e) {
      console.log("[open] Connection established");
      postMessage("[SOCKET] Connection established");
    };

    socketInstance.onmessage = function (event) {
      console.info(`[message] Data received from server: ${event.data}`);
    };

    socketInstance.onclose = function (event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code}`);
        postMessage(`[SOCKET] Connection closed cleanly, code=${event.code}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("[close] Connection died");
        postMessage("[SOCKET] Connection died");
      }
    };

    socketInstance.onerror = function (error) {
      console.log(`[error] ${error.message}`);
      postMessage(`[SOCKET] ${error.message}`);
      socketInstance.close();
    };
  } else {
    console.log("no socket instance");
  }
}

self.onmessage = function (event) {
  const workerData = event.data;
  postMessage("[WORKER]: Web worker onmessage established");

  switch (workerData.connectionStatus) {
    case "init":
      socketInstance = createSocketInstance();
      self.socketInstance = socketInstance;
      socketManagement();
      break;

    case "stop":
      socketInstance.close();
      break;

    default:
      if (self.socketInstance?.readyState === 1) {
        const { title, playerState, time, played, playedSecond } = workerData;
        self.socketInstance.send(
          JSON.stringify({
            played,
            playedSecond,
            title,
            playerState,
            time,
          }),
        );
      }

      socketManagement();
      break;
  }
};
