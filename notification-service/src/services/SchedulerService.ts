import { socketManager } from "../App";
import { HelperConstants } from "../config/HelperConstants";
import { SchedulerType } from "../enum/SchedulerType";
import { LOGGER } from "../utils/Logger";

export default class SchedulerService {

    private static schedulers: Map<number, Map<SchedulerType, NodeJS.Timeout>> = new Map()

    // cancel setTimeout
    public static cancelScheduler(schedulerType: SchedulerType, ownerId: number) {
        const scheduler = this.schedulers.get(ownerId);
        if (scheduler && scheduler.get(schedulerType)) {
            clearTimeout(scheduler.get(schedulerType));
            scheduler.delete(schedulerType)
        }
    }

    // manage set time out execution
    public static executeScheduler(schedulerType: SchedulerType, ownerId: number) {
        this.cancelScheduler(schedulerType, ownerId);
        let schedulerCallback: () => void;
        let delayInMs = 0;
        switch (schedulerType) {
            case SchedulerType.DisconnectPlayer: {
                delayInMs = HelperConstants.disconnectTimer;
                schedulerCallback = () => socketManager.removeSocket(ownerId as number);
                break;
            }
            default: {
                LOGGER.error(`Invalid scheduler type, data = ${JSON.stringify({ schedulerType, ownerId })}`);
                return;
            }
        }
        if (!this.schedulers.get(ownerId)) this.schedulers.set(ownerId, new Map());
        const userScheduler = this.schedulers.get(ownerId)!
        userScheduler.set(schedulerType,setTimeout(() => {
            schedulerCallback();
        }, delayInMs));
    }
}
