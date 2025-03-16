export class Logger {
    private verbose: Boolean;
    constructor(verbose: Boolean) {
        this.verbose = verbose;
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
