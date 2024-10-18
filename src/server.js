const app = require("./app");
const http = require("http");

const { setupSocket } = require('./services/Websocket/Connection'); 

const port = process.env.PORT || 3000;

require("./database");
app.set("port", port);

const server = http.createServer(app);

setupSocket(server);

server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
