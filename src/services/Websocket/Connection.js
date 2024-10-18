const { Server } = require('socket.io');
let io;

const setupSocket = (server) => {
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

// Function to get the io instance (for emitting events later)
const getIoInstance = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const getConnectedClients = () => {
    if (!io) {
      return [];
    }
    
    const clients = [];
    io.sockets.sockets.forEach((socket) => {
      clients.push({
        id: socket.id,
        handshake: socket.handshake,
      });
    });
    
    return clients;
  };
  

module.exports = { setupSocket, getIoInstance ,getConnectedClients };


