import { Kafka } from "kafkajs";
import { EnvConfig } from "../config/EnvConfig";
import { LOGGER } from "../config/Initialize";

export class KafkaClient {
    private static kafka: Kafka;
    private constructor() { }

    public static getKafka(): Kafka {
        const kafkaConfig = {
            clientId: 'notification-service',
            brokers: [`${EnvConfig.KAFKA_HOST}:${EnvConfig.KAFKA_PORT}`],
            groupId: 'promotion-consumer-group',
        };
        if (!this.kafka) {
            LOGGER.info(`Instantiated Kafka client: ${JSON.stringify(kafkaConfig)}`)
            this.kafka = new Kafka(kafkaConfig);
        }
        return this.kafka;
    }
}

