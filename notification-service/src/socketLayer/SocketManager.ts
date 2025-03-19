
import { Server, Socket } from 'socket.io';
import { IAuthSocket } from '../businnesLayer/interface/IAuthSocket';
import { HelperConstants } from '../config/HelperConstants';
import { SocketHandler } from './SocketHandler';
import SchedulerService from '../businnesLayer/services/SchedulerService';
import { SchedulerType } from '../businnesLayer/enum/SchedulerType';
import { LOGGER } from '../config/Initialize';
import { TokenType } from '../../../common/enum/TokenType';
import { ITokenPayload } from '../../../common/util/CommonInterfaces';
import { CustomError } from '../../../common/model/CustomError';
import { ErrorType } from '../../../common/enum/ErrorType';
import { verify } from "jsonwebtoken";
import { EnvConfig } from '../config/EnvConfig';

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
          const payload =  this.verifyJwt(authToken, TokenType.Access)
            socket.userId = payload.sub;
            return true;
        }
        catch (error) {
            return false;
        }
    }

    private verifyJwt(token: string, tokenType: TokenType): ITokenPayload {
        const jwtPayload: ITokenPayload = (verify(token, EnvConfig.JWT_SECRET)) as any;
        if (!jwtPayload || !jwtPayload.sub || jwtPayload.tokenType !== tokenType) throw new CustomError(ErrorType.Unauthorized, "Invalid token verification", { tokenType, token });
        return jwtPayload;
    };

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

