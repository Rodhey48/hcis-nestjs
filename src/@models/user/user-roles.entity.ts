import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UsersEntity } from '.';
import { RolesEntity } from '../role/roles.entity';

@Entity('user_roles')
export class UserRolesEntity extends BaseEntity {
    constructor(partial: Partial<UserRolesEntity>) {
        super();
        Object.assign(this, partial);
    }

    @ManyToOne(() => UsersEntity, user => user.roles, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true,
    })
    @JoinColumn()
    user: UsersEntity;

    @ManyToOne(() => RolesEntity, role => role.users, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true,
    })
    @JoinColumn()
    role: RolesEntity;
}
