import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';
import { EnvConfig } from './env.config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema,
        }),
    ],
    providers: [EnvConfig],
    exports: [EnvConfig],
})

export class ConfigModule {}