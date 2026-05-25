import { Injectable, Logger } from '@nestjs/common';
import { v2 as GoogleTranslate } from '@google-cloud/translate';

export type SupportedLang = 'en' | 'zh' | 'ja';

const GOOGLE_LANG_CODE: Record<SupportedLang, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
};

const SOURCE_LANG = 'ko';

export type MenuTranslationInput = {
  name?: string | null;
  description?: string | null;
};

export type MenuTranslationOutput = {
  nameEn: string | null;
  nameZh: string | null;
  nameJa: string | null;
  descriptionEn: string | null;
  descriptionZh: string | null;
  descriptionJa: string | null;
};

const EMPTY_TRANSLATION: MenuTranslationOutput = {
  nameEn: null,
  nameZh: null,
  nameJa: null,
  descriptionEn: null,
  descriptionZh: null,
  descriptionJa: null,
};

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private client: GoogleTranslate.Translate | null = null;

  /**
   * 한국어 입력(`name`·`description`)을 영/중/일 3개 언어로 동시 번역합니다.
   *
   * - 빈/공백/`null` 입력은 그대로 `null`을 반환합니다.
   * - 호출 한 번당 **언어별 1회**(총 최대 3회) Google API를 호출하고
   *   `Promise.all`로 병렬화합니다.
   * - 환경 변수 `GOOGLE_TRANSLATE_API_KEY`가 없으면 경고 로그 후
   *   모든 필드를 `null`로 반환(서비스는 정상 동작).
   * - API 호출 실패 시에도 예외를 던지지 않고 `null`로 폴백.
   */
  async translateMenuFields(
    input: MenuTranslationInput,
  ): Promise<MenuTranslationOutput> {
    const name = normalize(input.name);
    const description = normalize(input.description);

    if (!name && !description) {
      return { ...EMPTY_TRANSLATION };
    }

    const client = this.getClient();
    if (!client) {
      return { ...EMPTY_TRANSLATION };
    }

    const sources: Array<'name' | 'description'> = [];
    const texts: string[] = [];
    if (name) {
      sources.push('name');
      texts.push(name);
    }
    if (description) {
      sources.push('description');
      texts.push(description);
    }

    try {
      const langs: SupportedLang[] = ['en', 'zh', 'ja'];
      const results = await Promise.all(
        langs.map((lang) =>
          client.translate(texts, {
            from: SOURCE_LANG,
            to: GOOGLE_LANG_CODE[lang],
            format: 'text',
          }),
        ),
      );

      const out: MenuTranslationOutput = { ...EMPTY_TRANSLATION };

      langs.forEach((lang, i) => {
        const [translated] = results[i];
        const arr = Array.isArray(translated) ? translated : [translated];
        sources.forEach((src, idx) => {
          const value = arr[idx] ?? null;
          if (src === 'name') {
            if (lang === 'en') out.nameEn = value;
            else if (lang === 'zh') out.nameZh = value;
            else if (lang === 'ja') out.nameJa = value;
          } else {
            if (lang === 'en') out.descriptionEn = value;
            else if (lang === 'zh') out.descriptionZh = value;
            else if (lang === 'ja') out.descriptionJa = value;
          }
        });
      });

      return out;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.warn(
        `Google Translate API call failed; skipping translations: ${msg}`,
      );
      return { ...EMPTY_TRANSLATION };
    }
  }

  private getClient(): GoogleTranslate.Translate | null {
    if (this.client) return this.client;

    const key = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!key) {
      this.logger.warn(
        'GOOGLE_TRANSLATE_API_KEY is not set; auto-translation is disabled.',
      );
      return null;
    }

    this.client = new GoogleTranslate.Translate({ key });
    return this.client;
  }
}

function normalize(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}
