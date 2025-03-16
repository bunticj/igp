import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Promotion } from "./Promotion";

@Entity()
export class UserPromotions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userPromotions)
  user: User;

  @ManyToOne(() => Promotion, (promotion) => promotion.userPromotions)
  promotion: Promotion;
}
