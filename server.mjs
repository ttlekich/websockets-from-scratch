import { createServer } from "http";
import crypto from "crypto";

const PORT = 1337;
const WEBSOCKET_MAGIC_STRING_KEY = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const server = createServer((request, response) => {
    response.writeHead(200);
    response.end("Hello From Server");
}).listen(PORT, () => console.log("server listening to", PORT));

server.on("upgrade", onSocketUpgrade);

function onSocketUpgrade(request, socket, head) {
    const { "sec-websocket-key": webClientSocketKey } = request.headers;
    console.log(`${webClientSocketKey} connected!`);
    const headers = prepareHandshakeHeaders(webClientSocketKey);
    socket.write(headers);
}

function prepareHandshakeHeaders(id) {
    const acceptKey = createSocketAccept(id);
    const headers = [
        `HTTP/1.1 101 Switching Protocols`,
        `Upgrade: websocket`,
        `Connection: Upgrade`,
        `Sec-WebSocket-Accept: ${acceptKey}`,
        "",
    ]
        .map((line) => line.concat("\r\n"))
        .join("");
    return headers;
}

function createSocketAccept(id) {
    const sha1 = crypto.createHash("sha1");
    // Concate Id with Socket Key
    // SHA-1 hash
    sha1.update(id + WEBSOCKET_MAGIC_STRING_KEY);
    // Base64
    return sha1.digest("base64");
}

[
    // error handling to keep the server on
    ("uncaughtException", "unhandledRejection"),
].forEach((event) =>
    process.on(event, (err) => {
        console.error(
            `something bad happend! event: ${event}, msg: ${err.stack || stack}`
        );
    })
);
