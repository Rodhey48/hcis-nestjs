import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRolesEntity } from './user-roles.entity';

@Entity('users')
@Unique(['email', 'username', 'phone'])
export class UsersEntity extends BaseEntity {
  constructor(partial: Partial<UsersEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ nullable: true })
  pushToken: string;

  @Column({ type: 'boolean', default: true, name: 'is_password_changed' })
  isPasswordChanged: boolean;

  // relation table

  @OneToMany(() => UserRolesEntity, userRoles => userRoles.user)
  roles: UserRolesEntity[];
}
