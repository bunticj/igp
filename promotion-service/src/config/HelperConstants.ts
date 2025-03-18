import { EnvConfig } from "./EnvConfig";

export const HelperConstants = {
    // Names
    serverUrlName: `${EnvConfig.PROMOTION_SERVER_HOST}:${EnvConfig.PROMOTION_SERVER_PORT}`,
    serverFullUrlName: `${EnvConfig.HTTP_PROTOCOL_TYPE}://${EnvConfig.PROMOTION_SERVER_HOST}:${EnvConfig.PROMOTION_SERVER_PORT}`,

    // Constants
    welcomePromotionAmount: 10,


    // Configuration
    bcryptSaltRounds: 10,
    accessTokenExpirationInSeconds: 600, // 10 mins
    refreshTokenExpirationInSeconds: 28800, // 8h

}
