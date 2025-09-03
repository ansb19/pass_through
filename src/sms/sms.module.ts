import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SmsService } from "./sms.service";

@Module({
    // imports: [ConfigModule], // 이미 전역설정
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule { }