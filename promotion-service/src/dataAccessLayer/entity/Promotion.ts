import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPromotion } from "./UserPromotion";

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column("decimal")
  amount: number;

  @Column()
  isActive: boolean;

  @Column("timestamp")
  startDate: Date;

  @Column("timestamp")
  endDate: Date;

  @OneToMany(() => UserPromotion, (userPromotion) => userPromotion.promotion)
  userPromotions: UserPromotion[];
}
