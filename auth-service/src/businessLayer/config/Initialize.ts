import { EnvConfig } from "./EnvConfig";
import { WinstonLogger } from "../util/WinstonLogger";
import { ErrorHandler } from "../../../../common/util/ErrorHandler";

// Init logger
export const LOGGER = new WinstonLogger(EnvConfig.VERBOSE_LOGS);
// Init Error Handler
export const ERR_HANDLER = new ErrorHandler(LOGGER)