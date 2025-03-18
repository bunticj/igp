import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserPromotion } from "./UserPromotion";
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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => UserPromotion, (userPromotion) => userPromotion.user)
  userPromotions: UserPromotion[]; 
}
