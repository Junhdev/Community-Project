import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import BaseEntity from "./Entity";


@Entity("alarm")
export default class Alarm extends BaseEntity{
    
    
    
    @Column({ unique: true, nullable: true })
    publisher_id: number 

    
    
    @Column({ unique: true , nullable: true })
    receiver_id: number;

    
    @Column()
    type: string;

    @Column()
    content: string;

    @Column()
    redirect: string;

    @Column()
    status: boolean;

    
    // ManyToOne을 설정한 테이블에서는 relation id가 외래키를 가지고 있게 된다
    // @JoinColumn내부에 name설정을 따로 해주지 않으면 userId로 naming이 자동생성되어 외래키가 된다.
    // 여기서는 해당 유저의 인덱스인 id를 받아올때, user_id 라고 naming 해줄 것이다.
    // 참조컬럼명은 인덱스 정보를 뜻하므로 id라고 하자.
    // 여기서는 PK를 설정해주지 않을 것이므로 FK가 PK가 된다.

    // | sender_id   | number      |                            |
    // | user_id      | number      | FOREIGN KEY  PRIMARY KEY  | 
    @ManyToOne(() => User, (user) => user.alarm)
    @JoinColumn({ name: "alarm_id", referencedColumnName: "id" } )
    user: User;
    
    
}