export const SOCKET_SWAGGER_TAG = 'Socket.IO (실시간)' as const;

/** Swagger UI 에서 태그 펼치면 노출되는 개요(Markdown) */
export const SOCKET_SWAGGER_TAG_DESCRIPTION = `
### 연결 URL
REST API 서버와 **동일한 오리진**에 Socket.IO 클라이언트로 접속합니다. 네임스페이스는 기본값 **/** 입니다.

### 인증 (핸드셰이크)
- **권장**: \`auth: { token: '<스토어 JWT>' }\` — HTTP \`Authorization: Bearer\` 와 같은 토큰
- 또는 \`handshake.auth.boothId\` 또는 쿼리 \`boothId\` (숫자) → **storeId**

연결 시 서버가 룸 \`booth:{storeId}\` 에 클라이언트를 넣습니다. 아래 모든 이벤트는 해당 룸으로만 브로드캐스트됩니다.

### 클라이언트에서 구독
\`\`\`ts
socket.on('order.created', (payload) => { ... });
// socket.on(storeSocketEvents.WAITING_CREATED, ...) 등
\`\`\`

이벤트 이름 상수는 백엔드 \`STORE_SOCKET_EVENTS\`(\`notifications.events.ts\`)와 동일 문자열입니다.

### 이벤트·페이로드
| 이벤트 | 페이로드 스키마 (아래 GET 예시·Schemas 참고) |
|--------|-----------------------------------------------|
| \`order.created\` | 주문 계열 공통 |
| \`order.payment.paid\` | 주문 계열 공통 |
| \`order.status.canceled\` | 주문 계열 공통 |
| \`order.status.completed\` | 주문 계열 공통 |
| \`waiting.created\` | 웨이팅 생성 |
| \`waiting.status.canceled\` | 웨이팅 상태 변경 |
| \`waiting.status.entered\` | 웨이팅 상태 변경 |
| \`reservation.created\` | 예약 접수 |
| \`reservation.rejected\` | 예약 거절 |

**참고:** 이 태그의 GET 경로들은 스키마·예시 제공용입니다. 실행해도 동일 예시 바디만 돌려주며 실제 알림 전달은 Socket.IO 로만 일어납니다.
`.trim();
