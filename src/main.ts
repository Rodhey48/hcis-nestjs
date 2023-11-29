import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line
require('dotenv').config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.setGlobalPrefix(process.env.APP_PREFIX);
    app.useGlobalPipes(new ValidationPipe());

    if (
        process.env.APP_SWAGGER == 'true' ||
        typeof process.env.APP_SWAGGER == 'undefined'
    ) {
        const options = new DocumentBuilder()
            .setTitle('HCIS_API')
            .setDescription('API Documentasi HCIS')
            .setVersion('1.0.0')
            .addSecurity('bearer', {
                type: 'http',
                scheme: 'bearer',
            })
            .addTag('Auth')
            .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('docs', app, document);
    }

    await app.listen(3000);
}
bootstrap();
