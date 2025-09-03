import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { EnvConfig } from "src/config/env.config";

@Injectable()
export class EmailService {
    email_service: nodemailer.Transporter;

    constructor(
        private readonly config: EnvConfig
    ) {
        try {
            this.email_service = nodemailer.createTransport({
                service: this.config.EMAIL_SERVICE,
                host: this.config.EMAIL_HOST,
                port: this.config.EMAIL_PORT,
                auth: {
                    user: this.config.EMAIL_USER,
                    pass: this.config.EMAIL_PASSWORD,
                }
            })
        } catch (error) {
            throw new InternalServerErrorException('이메일 서비스 초기화 실패', error as Error);
        }
    }

    public async sendMail(email: string, title: string, content: string, html?: string): Promise<void> {
        const mail_options = {
            from: this.config.EMAIL_USER,
            to: email,
            subject: title,
            text: content,
            html: html,
        }

        try {
            const info = await this.email_service.sendMail(mail_options);
        } catch (error) {
            console.error('이메일 전송 중 오류 발생', error);
            throw new InternalServerErrorException('"이메일 전송 중 오류 발생"', error as Error);
        }
    }
}