/** CoolSMS / SOLAPI API Key·Secret (콘솔에서 발급) */
export const COOLSMS_API_KEY = process.env.COOLSMS_API_KEY ?? '';

export const COOLSMS_API_SECRET = process.env.COOLSMS_API_SECRET ?? '';

/**
 * 등록된 발신번호(하이픈 없이 또는 있어도 됨 — 전송 전 숫자만 추출).
 * 미설정 시 `CoolsmsService.sendOne` 호출 시 `from`을 반드시 넘겨야 합니다.
 */
export const COOLSMS_SENDER = process.env.COOLSMS_SENDER ?? '';
