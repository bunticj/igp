import { EnvConfig } from "./EnvConfig";
import { WinstonLogger } from "../businessLayer/util/WinstonLogger";
import { ErrorHandler } from "../../../common/util/ErrorHandler";
import DataSource from "../dataAccessLayer/OrmConfig"
import { AxiosHttpClient } from "../businessLayer/util/AxiosHttpClient";

// Init logger
export const LOGGER = new WinstonLogger(EnvConfig.VERBOSE_LOGS);

// Init Error Handler
export const ERR_HANDLER = new ErrorHandler(LOGGER)
export const DATA_SOURCE = DataSource

// Init Db Connection
setTimeout(() => {
  DataSource.initialize()
    .then(res => LOGGER.info("Database connected!"))
    .catch((error) => ERR_HANDLER.catchError(error))
}, 4000)


// Init Axios Http Client
export const HTTP_CLIENT = new AxiosHttpClient();

