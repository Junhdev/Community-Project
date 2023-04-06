import BaseEntity from "./Entity";
import { Column, Index, ManyToOne, JoinColumn, OneToMany, BeforeInsert, Entity } from "typeorm";
import { User } from "./User";
import Community from "./Community";
import Vote from "./Vote";
import Comment from "./Comment";
import { Exclude, Expose } from "class-transformer";
import { makeId, slugify } from "../utils/helpers";

@Entity("posts")
export default class Post extends BaseEntity {
    @Index()
    @Column()
    identifier: string;

    @Column()
    title: string;

    @Index()
    @Column()
    slug: string;

    @Column({nullable: true, type: "text"})
    body: string;

    @Column()
    subName: string;

    @Column()
    username: string;

    /* 1명의 유저가 여러개의 post를 할 수 있다 */
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;

    /* 1개의 커뮤니티는 여러개의 post를 가질 수 있다 */
    @ManyToOne(() => Community, (community) => community.posts)
    @JoinColumn({ name: "communityname", referencedColumnName: "name" })
    community: Community;

    /* 1개의 post는 여러개의 comment를 가질 수 있다 */
    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    /* 1개의 post는 여러개의 vote를 가질 수 있다 */
    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];

    
    @Expose() get url(): string {
        return '/r/$(this.communityname}/${this.identifier}/${this.slug}';
    }

    @Expose() get commentCount(): number {
        return this.comments?.length;
    }

    @Expose() get voteScore(): number {
        return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
    }

    protected userVote: number;

    setUserVote(user: User){
        const index = this.votes?.findIndex((v) => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }

    
}