import { Consumer } from 'kafkajs';
import { EnvConfig } from '../config/EnvConfig';
import { kafkaConfig } from '../config/KafkaConfig';
import { LOGGER } from '../utils/Logger';
import { KafkaClient } from './KafkaClient';

class KafkaConsumer {
    private consumer: Consumer
    constructor() {
        this.consumer = KafkaClient.getKafka().consumer({ groupId: kafkaConfig.groupId });
    }
    async consumeMessages() {
        await this.consumer.connect();
        LOGGER.info("Connected to Kafka");
        await this.consumer.subscribe({ topic: EnvConfig.KAFKA_TOPIC_NAME!, fromBeginning: true });
        LOGGER.info(`Subscribed to topic ${EnvConfig.KAFKA_TOPIC_NAME}`);

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                LOGGER.debug(`Received message: ${message.value}`);
                LOGGER.debug(`topic: ${topic}`);
                LOGGER.debug(`partition: ${partition}`);
            },
        });
    }
}
export const KConsumer = new KafkaConsumer();





