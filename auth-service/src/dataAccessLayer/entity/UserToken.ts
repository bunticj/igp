import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  
  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  @Column()
  refreshToken: string;

  @Column({
    type: 'timestamp'
  })
  expiresAt: Date;
}
