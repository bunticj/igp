import { Socket } from "socket.io";

export interface IAuthSocket extends Socket {
    userId?: number;
    shouldClearData?: Boolean
}