import { MigrationInterface, QueryRunner } from "typeorm";

export class Test231701056234959 implements MigrationInterface {
    name = 'Test231701056234959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "name" character varying, "email" character varying NOT NULL, "username" character varying NOT NULL, "phone" character varying, "password" character varying NOT NULL, "pushToken" character varying, "is_password_changed" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_d633ba2c5aef5c3c6018af9e445" UNIQUE ("email", "username", "phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
