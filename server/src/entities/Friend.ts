import BaseEntity from "./Entity";
import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("friends")
export class Friend extends BaseEntity {
    
    // BaseEntity에서 설정해주었던 id(인덱스)가 PK가 되고
    
    @Column({ unique: true, nullable: true })
    sender_id: number 

    
    
    @Column({ unique: true , nullable: true })
    receiver_id: number;

    
    @Column()
    accepted: boolean;

    // ManyToOne을 설정한 테이블에서는 relation id가 외래키를 가지고 있게 된다
    // @JoinColumn내부에 name설정을 따로 해주지 않으면 userId로 naming이 자동생성되어 외래키가 된다.
    // | id(인덱스)   | number      | PRIMARY KEY AUTO_INCREMENT |
    // | sender_id   | number      |                            |
    // | userId      | number      | FOREIGN KEY                | 
    @ManyToOne(() => User, (user) => user.friends)
    @JoinColumn({ name: "user_id", referencedColumnName: "user_id" } )
    user: User;
    
    
}
