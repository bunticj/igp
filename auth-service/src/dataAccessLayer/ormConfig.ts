import { EnvConfig } from "../businessLayer/config/EnvConfig";
import { DataSource } from "typeorm";


export default new DataSource({
    type: "postgres",
    host: EnvConfig.DB_HOST,
    port: EnvConfig.DB_PORT,
    username: EnvConfig.DB_USER,
    password: EnvConfig.DB_PASSWORD,
    database: EnvConfig.DB_NAME,
    entities: ['./src/dataAccessLayer/entity/*.{js,ts}'],
    migrations: ['./src/dataAccessLayer/migrations/*.{js,ts}'],
    synchronize: false,
    logging: EnvConfig.VERBOSE_LOGS,
})

