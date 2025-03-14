import { LOGGER } from "../utils/Logger";
import { KafkaClient } from "./KafkaClient"
import { Producer } from 'kafkajs';
import { EnvConfig } from '../config/EnvConfig';

class KafkaProducer {
    private producer: Producer
    constructor() {
        this.producer = KafkaClient.getKafka().producer();
    }
    async produceMessages() {
        await this.producer.connect()
        await this.producer.send({
            topic: EnvConfig.KAFKA_TOPIC_NAME!,
            messages: [
                { value: 'Hello, Kafka from another container! Produced at ' + new Date().toISOString() }
            ],
        })
        LOGGER.debug("Message sent to topic " + EnvConfig.KAFKA_TOPIC_NAME)
        await this.producer.disconnect()
    }
}
export const KProducer = new KafkaProducer();







