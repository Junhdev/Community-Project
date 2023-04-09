import { instanceToPlain } from "class-transformer";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export default abstract class Entity extends BaseEntity {
    /* id열을 Board 엔티티의 기본 키 열로 설정 */
    @PrimaryGeneratedColumn()
    id: number; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 프론트에서 imageUrl과 bannerUrl을 가져올 수 있게 함
    toJSON() {
        return instanceToPlain(this);
      }
}