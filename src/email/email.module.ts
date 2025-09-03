import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./email.service";
import { Module } from "@nestjs/common";

@Module({
    // imports: [ConfigModule], // 이미 전역설정
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }