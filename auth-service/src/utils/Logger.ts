import { EnvConfig } from "../config/EnvConfig";
import { logger } from 'express-winston';
import Winston from "winston";
import { Handler } from "express";


class Logger {
    private verbose: Boolean;
    public winstonLogger: Handler;
    constructor(verbose: Boolean) {
        this.verbose = verbose;
        this.winstonLogger = logger({
            transports: [new Winston.transports.Console()],
            format: Winston.format.combine(Winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS'
            }), Winston.format.json())
        });
    }
    public error(error: string): void {
        console.error(new Date().toISOString() + " [ERROR]: " + error);
    }

    public debug(message: string): void {
        if (!this.verbose) return;
        console.debug(new Date().toISOString() + " [DEBUG]: " + message);
    }

    public info(message: string): void {
        console.log(new Date().toISOString() + " [INFO]: " + message);
    }

    public critical(error: string): void {
        console.error(new Date().toISOString() + " [CRITICAL]: " + error);
    }
}

export const LOGGER = new Logger(EnvConfig.VERBOSE_LOGS)