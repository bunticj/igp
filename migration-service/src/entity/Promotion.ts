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
  is_active: boolean;

  @Column("timestamp")
  start_date: Date;

  @Column("timestamp")
  end_date: Date;

  @OneToMany(() => UserPromotion, (userPromotion) => userPromotion.promotion)
  userPromotions: UserPromotion[];
}
