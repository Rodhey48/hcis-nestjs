import {Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../base.entity";
import { UserRolesEntity } from "../user";

@Entity('roles')
export class RolesEntity extends BaseEntity {
    constructor(partial: Partial<RolesEntity>) {
        super();
        Object.assign(this, partial);
    }

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar' })
    description: string;

    // relation table

    @OneToMany(() => UserRolesEntity, userRoles => userRoles.role)
    users: UserRolesEntity[]
}