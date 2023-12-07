import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { RolesEntity, UserRolesEntity, UsersEntity } from '../src/@models';
import { JWTStrategy } from '../src/@services/jwt';
import { ConfigModule } from '@nestjs/config';
// eslint-disable-next-line
require('dotenv').config();

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            //   url: process.env.DB_URL,
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: 'HCIS_TEST',
            entities: [UsersEntity, UserRolesEntity, RolesEntity],
            migrationsTableName: 'migration',
            migrations: ['dist/@config/database/migrations/*.js'],
            synchronize: true,
            //   logging: true
        }),
        AuthModule,
        TypeOrmModule.forFeature([UsersEntity, UserRolesEntity, RolesEntity]),
    ],
    providers: [JWTStrategy],
})
export class AppTestingModule {}
