import { EnvConfig } from "../config/EnvConfig";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Promotion } from "./entity/Promotion";
import { UserPromotion } from "./entity/UserPromotion";

export default new DataSource({
    type: "postgres",
    host: EnvConfig.DB_HOST,
    port: EnvConfig.DB_PORT,
    username: EnvConfig.DB_USER,
    password: EnvConfig.DB_PASSWORD,
    database: EnvConfig.DB_NAME,
    entities: [User, Promotion, UserPromotion],
    migrations: ['./src/dataAccessLayer/migrations/*.{js,ts}'],
    logging: EnvConfig.VERBOSE_LOGS,
})

