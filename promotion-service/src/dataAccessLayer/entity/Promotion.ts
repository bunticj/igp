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

  constructor(title: string, description: string, amount: number, isActive: boolean, startDate: Date, endDate: Date) {
    this.title = title;
    this.description = description;
    this.amount = amount;
    this.isActive = isActive;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
