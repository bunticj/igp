import { Consumer } from 'kafkajs';
import { EnvConfig } from '../config/EnvConfig';
import { kafkaConfig } from '../config/KafkaConfig';
import { KafkaClient } from './KafkaClient';
import { ERR_HANDLER, LOGGER } from '../config/Initialize';
import ConsumerService from '../businnesLayer/services/ConsumerService';

class KafkaConsumer {
    private consumer: Consumer
    constructor() {
        this.consumer = KafkaClient.getKafka().consumer({ groupId: kafkaConfig.groupId });
    }

    async startConsuming() {
        await this.consumer.connect();
        LOGGER.info("Connected to Kafka");
        await this.consumer.subscribe({ topic: EnvConfig.KAFKA_TOPIC_NAME!, fromBeginning: true });
        LOGGER.info(`Subscribed to topic ${EnvConfig.KAFKA_TOPIC_NAME}`);
        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (topic === EnvConfig.KAFKA_TOPIC_NAME! && message.value) {
                    const stringValue = message.value.toString()
                    LOGGER.debug(`Received message: ${stringValue}`);
                    ConsumerService.handlePromotionMessage(stringValue)
                }
            }
        });
    }

    async shutDown() {
        LOGGER.info('Gracefully shutting down Kafka consumer...');
        await this.consumer.disconnect()
        process.exit(0);
    }



}

export const KConsumer = new KafkaConsumer();

setTimeout(() => {
    KConsumer.startConsuming().catch(err => ERR_HANDLER.catchError(err))
}, 5000)

