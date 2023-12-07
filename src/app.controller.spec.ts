import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
    let appController: AppController;
    let appModule: TestingModule;
    let appService: AppService

    beforeEach(async () => {
        appModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
            imports: [AppModule]
        }).compile();

        appController = appModule.get<AppController>(AppController);
        appService = appModule.get<AppService>(AppService);

    });

    describe('root', () => {
        it('should return "Hello World!"', async () => {
            const result = await appController.getHello();
            expect(result).toBe('Hello World!');
        });
    });

    it('should be defined', () => {

        expect(appModule).toBeDefined();
        expect(appController).toBeDefined();
        expect(appService).toBeDefined();
    });
});

describe('Main', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    // Add more tests as needed for initialization, configuration, etc.
});
