import { IMailService } from "./IMailService";
import { sendOtpMail } from "../../utils/sentoptmail";

export class NodeMailerService implements IMailService {
    async sendOtpMail(email: string, otp: string): Promise<void> {
        await sendOtpMail(email, otp);
    }
}
