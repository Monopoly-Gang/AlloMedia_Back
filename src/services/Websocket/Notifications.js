const { getIoInstance } = require('./Connection');
// const { io } = require('socket.io-client');


// const socket = io('http://localhost:3000');


const sendNotification = (message) => {
  socket.emit('notificatsocketn', { message });
};

const CreateClient = ()=>{
  socket.on('connection', () => {
    console.log('a user connected' , socket.id);
  });
}

module.exports = { sendNotification , CreateClient };
