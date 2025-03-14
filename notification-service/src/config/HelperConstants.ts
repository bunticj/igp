import { EnvConfig } from "./EnvConfig";

export const HelperConstants = {
    // configuration names
    serverFullUrlName: `${EnvConfig.HTTP_PROTOCOL_TYPE}://${EnvConfig.NOTIFICATION_HOST}:${EnvConfig.NOTIFICATION_PORT}`,

    // socket event names
    connectionName: "connection",
    disconnectName: "disconnect",
    messageName: "message",
    skipDisconnectReasonsArray: ["transport close", "ping timeout"],

    // scheduler duration
    disconnectTimer: 30000, // ms => 30s;
}
