import BaseEntity from './Entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from './User';
import Post from './Post';
import { Expose } from "class-transformer";

@Entity("subs")
export default class Sub extends BaseEntity{

    /* 커뮤니티명 column */
    @Index()
    @Column({ unique: true })
    name: string;

    /* 커뮤니티 제목 column */
    @Column()
    title: string;

    /* 커뮤니티 desc column */
    @Column({ type: 'text', nullable: true })
    description: string;

    /* 커뮤니티 프로필 아이콘 column */
    @Column({ nullable: true })
    imageUrn: string;

    /* 커뮤니티 배너 image column */
    @Column({ nullable: true })
    bannerUrn: string;

    /* 커뮤니티에 속해있는 user column (FK?) */
    @Column()
    username: string;

    /* 여러개의 Community에는 각각의 User가 존재 */
    @ManyToOne(()=>User)
    @JoinColumn({ name: "username", referencedColumnName: "username" }) // 첫번째 username은 22번 line, 두번째 username은 User.ts이 username
    user: User;

    /* 한개의 Coummunity에는 여러개의 post들이 존재 */
    @OneToMany(() => Post, (post) => post.sub)
    posts: Post[]

    /* class-transformer 사용 */
    @Expose()
    get imageUrl(): string {
        return this.imageUrl ? '${process.env.APP_URL}/images/${this.imageUrn}' : "https://www.gravatar.com/avatar?d=mp&f=y"; // false === 기본 image
    }

    @Expose()
    get bannerUrl(): string | undefined { // false일때 type은 undefined 이므로 union type으로 지정
        return this.bannerUrl ? '${process.env.APP_URL}/images/${this.bannerUrn}' : undefined;
    }
    
}