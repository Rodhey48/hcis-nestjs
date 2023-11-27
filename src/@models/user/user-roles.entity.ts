import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../base.entity";
import { UsersEntity } from ".";
import { RolesEntity } from "../role/roles.entity";

@Entity('user_roles')
export class UserRolesEntity extends BaseEntity {
    constructor(partial: Partial<UserRolesEntity>) {
        super();
        Object.assign(this, partial);
    }

    @ManyToOne(()=> UsersEntity, { onDelete: "CASCADE", onUpdate: 'CASCADE', eager: true})
    user: UsersEntity;

    @ManyToOne(()=> RolesEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true})
    role: RolesEntity;
}