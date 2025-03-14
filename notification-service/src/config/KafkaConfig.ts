import { EnvConfig } from "./EnvConfig";

export const kafkaConfig = {
  clientId: 'notification-service',
  brokers: [`${EnvConfig.KAFKA_HOST}:${EnvConfig.KAFKA_PORT}`],
  groupId: 'promotion-consumer-group',
};
