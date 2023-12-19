import { BcryptService } from 'src/@services/bcrypt/bcrypt.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeding1702534989343 implements MigrationInterface {
    name: 'Seeding initial';
    private readonly bcrypt = new BcryptService();
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataRole = [
            { name: 'Admin', description: 'Administrator' },
            { name: 'User', description: 'User Normal' },
        ];

        const dataUser = [
            {
                email: 'test@email.com',
                name: 'name of test',
                username: 'username test',
                phone: '6628645598655',
                password: 'Asd123',
                roles: ['Admin'],
            },
            {
                email: 'test2@email.com',
                name: 'name of test 2',
                username: 'username test 2',
                phone: '6628645598656',
                password: 'Asd123',
                roles: ['User', 'Admin'],
            },
        ];

        // seeeding data role

        for (const role of dataRole) {
            await queryRunner.query(
                `INSERT INTO roles (name, description) VALUES ('${role.name}', '${role.description}')`,
            );
        }

        // sedding user

        for (const user of dataUser) {
            const userId = await queryRunner.query(
                `INSERT INTO users (email, name, username, phone, password) VALUES ('${
                    user.email
                }', '${user.name}', '${user.username}', '${
                    user.phone
                }', '${this.bcrypt.createHashPassword(user.password)}')`,
            );

            for (const role of user.roles) {
                await queryRunner.query(
                    `INSERT INTO user_roles (userId, roleId) SELECT ${userId[0].id}, id FROM roles WHERE name = '${role}'`,
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM users');
        await queryRunner.query('DELETE FROM roles');
        await queryRunner.query('DELETE FROM user_roles');
    }
}
