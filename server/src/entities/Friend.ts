import BaseEntity from "./Entity";
import { Entity, Column, Index, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("friends")
export class Friend extends BaseEntity {

    @Index()
    @Column({ unique: true })
    sender_idx: number;

    
    @Index()
    @Column({ unique: true })
    receiver_idx: number;

    
    @Column()
    accepted: boolean;

    
    @ManyToOne(() => User, (user) => user.friends)
    user: User;
    
    
}
