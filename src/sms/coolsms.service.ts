import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import CoolsmsMessageService from 'coolsms-node-sdk';
import {
  COOLSMS_API_KEY,
  COOLSMS_API_SECRET,
  COOLSMS_SENDER,
} from './coolsms.constants';

export type SendSmsParams = {
  /** 수신번호 (예: 01012345678, 010-1234-5678) */
  to: string;
  text: string;
  /** 미지정 시 `COOLSMS_SENDER` */
  from?: string;
};

@Injectable()
export class CoolsmsService {
  private readonly logger = new Logger(CoolsmsService.name);
  private client: CoolsmsMessageService | null = null;

  /** API Key·Secret이 모두 있으면 true */
  isConfigured(): boolean {
    return Boolean(COOLSMS_API_KEY.trim() && COOLSMS_API_SECRET.trim());
  }

  private getClient(): CoolsmsMessageService {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException(
        'COOLSMS_API_KEY / COOLSMS_API_SECRET 환경변수를 설정하세요.',
      );
    }
    if (!this.client) {
      this.client = new CoolsmsMessageService(
        COOLSMS_API_KEY.trim(),
        COOLSMS_API_SECRET.trim(),
      );
    }
    return this.client;
  }

  private digitsOnly(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * 단문/LMS 1건 발송 (SDK가 길이에 따라 타입 결정).
   * @see https://github.com/coolsms/coolsms-nodejs
   */
  async sendOne(params: SendSmsParams) {
    const fromRaw = params.from?.trim() || COOLSMS_SENDER.trim();
    if (!fromRaw) {
      throw new ServiceUnavailableException(
        '발신번호가 없습니다. `from` 인자 또는 COOLSMS_SENDER 환경변수를 설정하세요.',
      );
    }

    const to = this.digitsOnly(params.to);
    const from = this.digitsOnly(fromRaw);
    if (!to || !from) {
      throw new ServiceUnavailableException(
        '수신번호·발신번호가 올바르지 않습니다.',
      );
    }

    const client = this.getClient();
    try {
      const result = await client.sendOne({
        to,
        from,
        text: params.text,
      } as Parameters<CoolsmsMessageService['sendOne']>[0]);
      return result;
    } catch (err) {
      this.logger.warn(
        `CoolSMS sendOne failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      throw err;
    }
  }
}
