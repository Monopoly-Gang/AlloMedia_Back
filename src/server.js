const app = require("./app");
const http = require("http");

const port = process.env.PORT || 3000;

require("./database");
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
