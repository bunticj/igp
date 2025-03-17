import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { UserPromotion } from "./UserPromotion";
import { RoleType } from "../../../common/enum/RoleType";
import { UserToken } from "./UserToken";

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
  created_at: Date;

  @OneToMany(() => UserPromotion, (userPromotion) => userPromotion.user)
  userPromotions: UserPromotion[];
  
  @OneToOne(() => UserToken, (userToken) => userToken.user)
  userToken: UserToken;
}
