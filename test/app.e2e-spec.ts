import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppTestingModule } from './app-testing.module';
import { UsersEntity } from '../src/@models/user/user.entity';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<UsersEntity>; // Gantilah 'UserEntity' dengan nama entitas yang sesua;

    let token = "";

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppTestingModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        userRepository = moduleFixture.get<Repository<UsersEntity>>(
            getRepositoryToken(UsersEntity), // Gantilah 'UserEntity' dengan nama entitas yang sesuai
        );

        await app.init();

        // Tambahkan kode seed data ke basis data pengujian
        await seedTestData();
    });

    it('/register', async () => {
        const payload = {
            "email": "test@testing.com",
            "name": "albert wene testing",
            "username": "albert wene testing",
            "phone": "62897777767",
            "password": "isSecret"
        }

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(payload)
            .expect(201)

        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('message', 'Success save user');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('user');
    })

    it('/login', async () => {
        const payload = {
            identifier: "test@testing.com",
            password: 'isSecret',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login') // Assuming your login endpoint is a POST request
            .send(payload)
            .expect(201);

        // Perform assertions based on your expected response
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('message', 'Login success');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('token');
        token = response.body.data.token
        // You may want to add more assertions based on your response structure
    });

    it('/logged', async () => {
        const response = await request(app.getHttpServer())
            .get("/auth/logged")
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('message', 'Success login');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('user');
    })

    afterAll(async () => {
        // Tambahkan kode untuk membersihkan atau mereset basis data pengujian jika diperlukan
        await cleanupTestData();

        await app.close();
    });

    // Tambahkan fungsi untuk menanamkan data awal atau seed data ke dalam basis data pengujian
    async function seedTestData() {
        await userRepository.delete({}); // Menghapus semua data pengguna
        // Lakukan operasi untuk menanamkan data awal atau seed data ke dalam basis data pengujian
        // Contoh:
        const hashPassword = await bcrypt.hashSync('isSecret', 10)
        await userRepository.save([{ username: 'testuser', password: hashPassword, email: "test@email.com", phone: "123456789" }, { username: 'test@test.com', password: hashPassword, email: "test@test.com", phone: "00987747" }]);
    }

    // Tambahkan fungsi untuk membersihkan atau mereset basis data pengujian jika diperlukan
    async function cleanupTestData() {
        // Lakukan operasi untuk membersihkan atau mereset basis data pengujian
        // Contoh:
        await userRepository.delete({}); // Menghapus semua data pengguna
    }
});
