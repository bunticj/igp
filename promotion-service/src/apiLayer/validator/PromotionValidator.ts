
import { dateTransformer } from 'src/businessLayer/util/DateTransformer';
import { z } from 'zod';

export class PromotionValidator {

    public static promotionBodySchema() {
        return z.object({
            title: z.string(),
            description: z.string(),
            amount: z.number().nonnegative('Amount cannot be less than zero'),
            isActive: z.boolean(),
            startDate: z.preprocess(dateTransformer, z.date()),
            endDate: z.preprocess(dateTransformer, z.date()),
        });
    }

    public static createPromotionBodySchema() {
        return z.object({
            promotion: this.promotionBodySchema(),
            userIds: z.array(z.number()).nonempty('User IDs cannot be empty'),
        });
    }
}






