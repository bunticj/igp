import { LOGGER } from "../utils/Logger";
import { KafkaClient } from "./KafkaClient"
import { Producer } from 'kafkajs';
import { EnvConfig } from '../config/EnvConfig';
import { errorHandler } from "../utils/ErrorHandler";

class KafkaProducer {
    private producer: Producer
    constructor() {
        this.producer = KafkaClient.getKafka().producer();
    }
    async produceMessages() {
        await this.producer.connect()
    const result =     await this.producer.send({
            topic: EnvConfig.KAFKA_TOPIC_NAME!,
            messages: [
                { value: 'Hello, Kafka from another container! Produced at ' + new Date().toISOString() }
            ],
        })
        LOGGER.debug(`Messages: ${JSON.stringify(result)}`)
        await this.producer.disconnect()
    }
}
export const KProducer = new KafkaProducer();

setTimeout(()=> {
   KProducer.produceMessages().catch(err => errorHandler(err))
   }, 10000)





