import { KafkaClient } from "./KafkaClient"
import { Producer } from 'kafkajs';
import { ERR_HANDLER, LOGGER } from "../config/Initialize";

class KafkaProducer {
    private producer: Producer
    constructor() {
        this.producer = KafkaClient.getKafka().producer();
    }

    async init() {
        await this.producer.connect();
        LOGGER.info("Kafka producer connected")
    }

    async produceMessages<T>(topic: string, data: T) {
        try {
            const result = await this.producer.send({
                topic: topic,
                messages: [{ value: Buffer.from(JSON.stringify(data)) }],
            })
            LOGGER.debug(`Messages produced: ${JSON.stringify(result)}`)
        } catch (err) {
            ERR_HANDLER.catchError(err as Error, { topic, data })
        }
    }

    async shutDown() {
        LOGGER.info('Gracefully shutting down Kafka Producer...');
        await this.producer.disconnect()
        process.exit(0);
    }
}

export const KProducer = new KafkaProducer();
KProducer.init();






