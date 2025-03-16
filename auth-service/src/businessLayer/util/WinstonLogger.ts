import { Logger } from "../../../../common/util/Logger"
import Winston from "winston";
import { logger } from 'express-winston';
import { Handler } from "express";

export class WinstonLogger extends Logger {
    public winstonLogger: Handler;
    constructor(verbose: Boolean) {
        super(verbose)
        this.winstonLogger = logger({
            transports: [new Winston.transports.Console()],
            format: Winston.format.combine(Winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS'
            }), Winston.format.json())
        });
    }
}


