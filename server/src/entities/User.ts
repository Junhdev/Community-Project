import BaseEntity from "./Entity";
import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import bcrypt from 'bcryptjs';
import Post from "./Post";
import Like from "./Like";
import FriendShip  from "./FriendShip";
import { Expose } from "class-transformer";
import Alarm from "./Alarm";

@Entity("users")
export class User extends BaseEntity {
    @Index()
    @Length(6, 20 , {message: "사용자 아이디는 6자 이상이어야 합니다"})
    @Column({ unique: true, nullable: true } )
    userID: string;

    /* email column */
    @Index()
    @IsEmail(undefined, {message: "이메일 주소가 잘못되었습니다."})
    @Length(1, 255, {message: "이메일 주소는 비워둘 수 없습니다."})
    @Column({ unique: true })
    email: string;

    /* username column */
    @Index()
    @Length(3, 32, {message: "사용자 이름은 3자 이상이어야 합니다"})
    @Column({ unique: true })
    username: string;

    /* password column */
    @Column()
    @Length(6, 255, {message: "비밀번호는 6자리 이상이어야 합니다."})
    password: string;

    @Column({ nullable: true })
    profileImg: string;

    /* 1명의 User가 여러개의 게시글을 post 할 수 있음 */
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    /* 1명의 User가 여러개의 like를 할 수 있음 */
    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

     /* 1명의 User가 여러명과 친구관계를 맺을 수 있음 */
    @OneToMany(() => FriendShip, (friendship) => friendship.user)
    friendship: FriendShip[];

    @OneToMany(() => Alarm, (alarm) => alarm.user)
    alarm: Alarm[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }

    @Expose()
    get imageUrl(): string {
        return this.profileImg ? `${process.env.APP_URL}/images/${this.profileImg}` : "https://www.gravatar.com/avatar?d=mp&f=y"; // false === 기본 image
    }


}
