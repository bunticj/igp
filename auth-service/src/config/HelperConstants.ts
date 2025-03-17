import { EnvConfig } from "./EnvConfig";

export const HelperConstants = {
    serverUrlName: `${EnvConfig.AUTH_SERVER_HOST}:${EnvConfig.AUTH_SERVER_PORT}`,
    serverFullUrlName: `${EnvConfig.HTTP_PROTOCOL_TYPE}://${EnvConfig.AUTH_SERVER_HOST}:${EnvConfig.AUTH_SERVER_PORT}`,

    // Configuration
    bcryptSaltRounds: 10,
    accessTokenExpirationInSeconds: 600, // 10 mins
    refreshTokenExpirationInSeconds: 28800, // 8h

}
