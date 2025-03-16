import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPromotions } from "./UserPromotions";
import { RoleType } from "../../../../common/enum/RoleType";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  role: RoleType;

  @Column({
    type: 'decimal',
    default: 0.00,
  })
  balance: number;

  @OneToMany(() => UserPromotions, (userPromotion) => userPromotion.user)
  userPromotions: UserPromotions[];
}
