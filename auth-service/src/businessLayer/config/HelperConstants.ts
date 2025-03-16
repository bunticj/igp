import { EnvConfig } from "./EnvConfig";

export const HelperConstants = {
    serverFullUrlName: `${EnvConfig.HTTP_PROTOCOL_TYPE}://${EnvConfig.AUTH_SERVER_HOST}:${EnvConfig.AUTH_SERVER_PORT}`,
    bcryptSaltRounds : 10
}
