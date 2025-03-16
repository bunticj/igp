import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPromotions } from "./UserPromotions";

@Entity()
export class UserTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  refreshToken: string;

  @Column()
  role: number;

  @Column("decimal")
  balance: number;

  @OneToMany(() => UserPromotions, (userPromotion) => userPromotion.user)
  userPromotions: UserPromotions[];
}
