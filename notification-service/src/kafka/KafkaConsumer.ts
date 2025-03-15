import { Consumer } from 'kafkajs';
import { EnvConfig } from '../config/EnvConfig';
import { kafkaConfig } from '../config/KafkaConfig';
import { LOGGER } from '../utils/Logger';
import { KafkaClient } from './KafkaClient';
import { errorHandler } from '../utils/ErrorHandler';

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
            eachMessage: async ({ topic, partition, message }) => {
                LOGGER.debug(`Received message: ${message.value}`);
                LOGGER.debug(`topic: ${topic}`);
                LOGGER.debug(`partition: ${partition}`);
            },
        });
    }

  async  shutDown() {
    LOGGER.info('Gracefully shutting down Kafka consumer...');
        await this.consumer.disconnect()
        process.exit(0);
    }

}

export const KConsumer = new KafkaConsumer();

setTimeout(()=> {
 KConsumer.startConsuming().catch(err => errorHandler(err))

}, 7000)


process.on('SIGINT', async () => {
    await KConsumer.shutDown();
    });

process.on('SIGTERM', async () => {
      await KConsumer.shutDown();
});
