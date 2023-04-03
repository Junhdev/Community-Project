import BaseEntity from "./Entity";
import { IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import bcrypt from 'bcryptjs';
import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export class User extends BaseEntity {

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


    /* 1명의 User가 여러개의 게시글을 post 할 수 있음 */
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    /* 1명의 User가 여러개의 vote를 할 수 있음 */
    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }


}
