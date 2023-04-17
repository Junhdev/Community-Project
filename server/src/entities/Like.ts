import BaseEntity from "./Entity";
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import Post from "./Post";
import Comment from "./Comment";




@Entity('likes')
export default class Like extends BaseEntity{
    @Column()
    value: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User

    @Column()
    username: string;

    /* comment에 대한 vote일때 */
    @Column({ nullable: true })
    postId: number;

    @ManyToOne(() => Post)
    post: Post;

    /* post에 대한 vote일때 */
    @Column({ nullable: true })
    commentId: number;

    @ManyToOne(() => Comment)
    comment: Comment
}