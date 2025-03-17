import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { UserToken } from "./UserToken";
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
  created_at: Date;

    @OneToOne(() => UserToken, (userToken) => userToken.user)
  userToken: UserToken;
}
