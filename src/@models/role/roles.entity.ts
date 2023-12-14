import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRolesEntity, UsersEntity } from '../user';

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

    @ManyToMany(() => UsersEntity, (user) => user.roles)
    @JoinTable({ name: "user_roles", synchronize: false })
    users: UsersEntity[];
}
