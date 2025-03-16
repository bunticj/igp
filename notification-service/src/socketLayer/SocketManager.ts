
import { Server, Socket } from 'socket.io';
import { IAuthSocket } from '../businnesLayer/interface/IAuthSocket';
import { HelperConstants } from '../businnesLayer/config/HelperConstants';
import { SocketHandler } from './SocketHandler';
import SchedulerService from '../businnesLayer/services/SchedulerService';
import { SchedulerType } from '../businnesLayer/enum/SchedulerType';
import { LOGGER } from '../businnesLayer/config/Initialize';

export class SocketManager {
    private userSockets: Map<number, SocketHandler> = new Map();
    public io: Server;
    constructor(io: Server) {
        this.io = io;
        this.setupSockets();
    }

    private setupSockets() {
        this.io.use(async (socket: Socket, next) => {
            if (await this.authenticateSocket(socket as IAuthSocket)) next();
            else {
                LOGGER.error(`Invalid authentication ${socket.handshake.query.authorization}`);
                socket.disconnect(true);
            }
        });

        this.io.on(HelperConstants.connectionName, (socket: IAuthSocket) => {
            LOGGER.debug(`User ${socket.userId} connected with socket ${socket.id}`);
            this.addNewSocket(socket);
        });
    }

    private async authenticateSocket(socket: IAuthSocket): Promise<boolean> {
        try {
            if (!socket || !socket.handshake.query.authorization) return false;
            const authToken = socket.handshake.query.authorization as string;
            socket.userId = authToken.length;
            return true;
        }
        catch (error) {
            return false;
        }
    }

    // init socket handlers, and save them for reference
    private addNewSocket(socket: IAuthSocket) {
        const userId = socket.userId!;
        SchedulerService.cancelScheduler(SchedulerType.DisconnectPlayer, userId);
        const oldSocketHandler = this.userSockets.get(userId);
        this.userSockets.set(userId, new SocketHandler(socket, oldSocketHandler?.socket));
    }

    public removeSocket(userId: number) {
        SchedulerService.cancelScheduler(SchedulerType.DisconnectPlayer, userId);
        this.userSockets.delete(userId)
    }

    public getSocketId(userId: number): string | undefined {
        return this.userSockets.get(userId)?.socket.id
    }
}

