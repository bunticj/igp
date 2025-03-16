import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPromotions } from "./UserPromotions";

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
  is_active: boolean;

  @Column("timestamp")
  start_date: Date;

  @Column("timestamp")
  end_date: Date;

  @OneToMany(() => UserPromotions, (userPromotion) => userPromotion.promotion)
  userPromotions: UserPromotions[];
}
