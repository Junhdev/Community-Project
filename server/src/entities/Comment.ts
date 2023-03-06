import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import BaseEntity from "./Entity";
import { User } from "./User";
import Post from "./Post";
import Vote from "./Vote";
import { Exclude, Expose } from "class-transformer";
import { makeId } from "../utils/helpers";


@Entity("comments")
export default class Comment extends BaseEntity{
    @Index()
    @Column()
    identifier: string;

    @Column()
    body: string;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;
    
    @Column()
    postId: number;

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    post: Post;

    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.comment)
    votes: Vote[];

    //???
    protected userVote: number;

    /* 좋아요나 싫어요 버튼 누른사람에 대해 좋아요를 눌렀으면 value값 === 1, 싫어요를 눌렀으면 value값 === -1, 아무것도 누르지 않았으면 0 반환 */
    setUserVote(user: User){
        const index = this.votes?.findIndex((v) => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    /* 좋아요를 누른 횟수와 싫어요를 누른 횟수의 합 반환 */
    @Expose() get voteScore(): number{
        const initialValue = 0;
        return this.votes?.reduce((previousValue, currentObject) =>
            previousValue + (currentObject.value || 0), initialValue)
    }

    @BeforeInsert()
    makeId(){
        this.identifier = makeId(8);
    }
    

}
