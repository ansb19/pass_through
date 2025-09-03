import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import * as qs from "qs";

// import CoolsmsMessageService from "coolsms-node-sdk";
import { EnvConfig } from "src/config/env.config";

@Injectable()
export class SmsService {

    private aligo_api_url = "https://apis.aligo.in";
    private segment = "/send/";
    private aligo_api_key;
    private aligo_user_id;
    private sender;
    // private sms_service: CoolsmsMessageService;

    constructor(
        private readonly config: EnvConfig,
    ) {
        try {
            // this.sms_service = new CoolsmsMessageService(
            //     this.config.SMS_API_KEY,
            //     this.config.SMS_API_SECRET
            // );
            this.aligo_api_key = this.config.ALIGO_API_KEY;
            this.aligo_user_id = this.config.ALIGO_USER_ID;
            this.sender = this.config.SENDER_PHONE;

        } catch (error) {
            throw new InternalServerErrorException("SMS 서비스 초기화 중 오류 발생", error as Error);
        }
    }

    public async sendSMS(phone: string, text: string): Promise<void> {
        try {
            // const result = await this.sms_service.sendOne({
            //     to: phone,
            //     from: this.config.SENDER_PHONE,
            //     text: text,
            //     autoTypeDetect: false,
            //     type: 'SMS'
            // });
            const data = {
                key: this.aligo_api_key,
                user_id: this.aligo_user_id,
                sender: this.sender,
                receiver: phone,
                msg: text,
                msg_type: "SMS"
            };

            const response = await axios.post(
                `${this.aligo_api_url}${this.segment}`,
                qs.stringify(data, { encode: true }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            console.log("알리고 원본 응답:", response.data);
            const result = response.data;
            if (result.result_code !== '1') {
                console.error("알리고 SMS 전송 실패:", result);
                throw new InternalServerErrorException(`SMS 전송 실패: ${result.message}`);
            }
        } catch (error) {
            console.error('SMS 전송 중 오류 발생', error);
            throw new InternalServerErrorException("SMS 전송 중 오류 발생", error as Error);
        }
    }
}