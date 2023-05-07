import { createServer } from "http";
const PORT = 1337;

const server = createServer((request, response) => {
    response.writeHead(200);
    response.end("Hello From Server");
}).listen(PORT, () => console.log("server listening to", PORT));

server.on("upgrade", (request, socket, head) => {
    console.log({
        request,
        socket,
        head,
    });
});

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
