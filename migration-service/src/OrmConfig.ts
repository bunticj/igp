import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Promotion } from "./entity/Promotion";
import { UserPromotion } from "./entity/UserPromotion";
import { UserToken } from "./entity/UserToken";
import * as dotenv from "dotenv";
dotenv.config();


export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Promotion, UserPromotion, UserToken],
    migrations: ['./src/migrations/*.ts}'],
    synchronize: true, // TODO turn off on prod
    logging: true,
})

