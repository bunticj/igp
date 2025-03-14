import { Kafka } from "kafkajs";

export class KafkaClient {
    private static kafka: Kafka;
    private constructor() { }
    
    public static getKafka(): Kafka {
        const kafkaConfig = {
            clientId: 'notification-service',
            brokers: [`localhost:9092`],
            groupId: 'promotion-consumer-group',
        };
        if (!this.kafka) this.kafka = new Kafka(kafkaConfig);
        return this.kafka;
    }
}

