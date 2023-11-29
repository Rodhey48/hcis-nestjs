import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUser1701137136573 implements MigrationInterface {
    name = 'FixUser1701137136573';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_d633ba2c5aef5c3c6018af9e445"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" integer`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_d633ba2c5aef5c3c6018af9e445" UNIQUE ("email", "username", "phone")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_d633ba2c5aef5c3c6018af9e445"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD "phone" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_d633ba2c5aef5c3c6018af9e445" UNIQUE ("email", "username", "phone")`,
        );
    }
}
