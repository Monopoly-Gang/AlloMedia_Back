const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // { userId: socketId }
    }

    initialize(server) {
        this.io = socketIo(server, {
            cors: {
                origin: process.env.FRONT_APP_HOST,
                credentials: true
            }
        });

        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) throw new Error('Authentication error');
                
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.id;
                socket.userRole = decoded.role;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });

        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.io.on('connection', (socket) => {
            this.connectedUsers.set(socket.userId, socket.id);

            socket.on('disconnect', () => {
                this.connectedUsers.delete(socket.userId);
            });
        });
    }

    notifyUser(userId, event, data) {
        const socketId = this.connectedUsers.get(userId.toString());
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }

    notifyByRole(role, event, data) {
        this.io.sockets.sockets.forEach(socket => {
            if (socket.userRole === role) {
                socket.emit(event, data);
            }
        });
    }
}

module.exports = new SocketService();

