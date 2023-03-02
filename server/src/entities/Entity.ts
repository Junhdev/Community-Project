import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export default abstract class Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; // id열이 Board 엔티티의 기본 키 열

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}