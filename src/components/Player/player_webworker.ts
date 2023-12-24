/* eslint-disable no-restricted-globals */
// websocket-worker.ts
self.addEventListener('message', (event) => {

 const { action, data } = event.data as { action: string; data: any };

 // Handle WebSocket connection
 const ws = new WebSocket('wss://localhost:9002');

 ws.onopen = () => {
  // Handle WebSocket open event
  self.postMessage({ event: 'open' });
 };

 ws.onmessage = (message) => {
  // Handle WebSocket message event
  self.postMessage({ event: 'message', data: message.data });
 };

 ws.onclose = () => {
  // Handle WebSocket close event
  self.postMessage({ event: 'close' });
 };

 // You can also add error handling for WebSocket errors
 ws.onerror = (error) => {
  // self.postMessage({ event: 'error', error: error.message });
  self.postMessage("error: Something went wrong ")
 };

 // Store the WebSocket instance to manage it later
 (self as any).ws = ws;
 if (action === 'send') {
  // Send data over WebSocket
  if (ws.readyState === WebSocket.OPEN) {
   (self as any).ws.send(data);
  }
 } else if (action === 'disconnect') {
  debugger
  // Close the WebSocket connection
  (self as any).ws.close();
 }
});

//@ts-ignore
// self.onmessage = (e: MessageEvent<string>, playerSocket: WebSocket) => {
//  self.postMessage({ msg: "Hello from the worker!" });

//  while (playerSocket.readyState === WebSocket.OPEN) {
//   playerSocket.send("YEEEEEEEEEEAH")
//   setTimeout(() => {
//    console.log(" loop")
//   }, 3000)
//  }
// };

export { };