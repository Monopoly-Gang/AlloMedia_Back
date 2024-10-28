const app = require("./app");
const http = require("http");
const socketService = require("./services/socketService");

const port = process.env.PORT || 3000;

require("./database");
app.set("port", port);

const server = http.createServer(app);

// Initialiser le service WebSocket
socketService.initialize(server);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
