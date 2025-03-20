import { IKafkaEvent, IPromotion } from "../../../../common/util/CommonInterfaces";
import MessageService from "./MessageService";
import { Message } from "../model/Message";
import { MessageType } from "../enum/MessageType";
import { ERR_HANDLER } from "../../config/Initialize";


export default class ConsumerService {

    public static handlePromotionMessage(jsonString: string): void {
        try {
            const parsed = JSON.parse(jsonString) as IKafkaEvent<IPromotion>;
            const message = new Message(MessageType.PromotionMessage, parsed.data);
            parsed.recipients.forEach(userId => MessageService.sendMessageToUserId(userId, message));
        }
        catch (error) {
            ERR_HANDLER.catchError(error as Error, { stringMsg: jsonString });
        }
    }


}

