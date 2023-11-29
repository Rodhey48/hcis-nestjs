import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// eslint-disable-next-line
require('dotenv').config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            //   url: process.env.DB_URL,
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ['dist/**/*.entity.js'],
            migrationsTableName: 'migration',
            migrations: ['dist/@config/database/migrations/*.js'],
            synchronize: false,
            //   logging: true
        }),
        AuthModule,
    ],
})
export class AppModule {}
