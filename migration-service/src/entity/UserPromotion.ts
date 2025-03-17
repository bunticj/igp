import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Promotion } from "./Promotion";

@Entity()
export class UserPromotion {
  @PrimaryColumn()
  userId: number; 

  @PrimaryColumn()
  promotionId: number;  

  @ManyToOne(() => User, (user) => user.userPromotions)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Promotion, (promotion) => promotion.userPromotions)
  @JoinColumn({ name: "promotionId" })
  promotion: Promotion;
}
