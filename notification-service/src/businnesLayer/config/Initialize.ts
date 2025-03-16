import { EnvConfig } from "./EnvConfig";
import { ErrorHandler } from "../../../../common/util/ErrorHandler";
import { Logger } from "../../../../common/util/Logger";

// Init logger
export const LOGGER = new Logger(EnvConfig.VERBOSE_LOGS);

// Init Error Handler
export const ERR_HANDLER = new ErrorHandler(LOGGER)

