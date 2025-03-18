import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./User";
import { Promotion } from "./Promotion";

@Entity()
export class UserPromotion {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  promotionId: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  claimedAt?: Date;

  @ManyToOne(() => User, (user) => user.userPromotions)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Promotion, (promotion) => promotion.userPromotions)
  @JoinColumn({ name: "promotionId" })
  promotion: Promotion;
 
  constructor(userId: number, promotionId: number, claimedAt?: Date) {
    this.userId = userId;
    this.promotionId = promotionId;
    this.claimedAt = claimedAt;
  }
}
