import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User";
import { Promotion } from "./entity/Promotion";
import { UserPromotions } from "./entity/UserPromotions";
import { EnvConfig } from "../businessLayer/config/EnvConfig";
import { ERR_HANDLER } from "../businessLayer/config/Initialize";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: EnvConfig.DB_HOST,
    port: EnvConfig.DB_PORT,
    username: EnvConfig.DB_USER,
    password: EnvConfig.DB_PASSWORD,
    database: EnvConfig.DB_NAME,
    entities: [User, Promotion, UserPromotions],
    migrations: ['./src/migrations/*.ts'],
      synchronize: true,
    logging: EnvConfig.VERBOSE_LOGS,
})

AppDataSource.initialize()
    .catch((error) => ERR_HANDLER.catchError(error))
