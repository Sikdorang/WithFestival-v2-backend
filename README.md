# WithFestival v2 — Backend

NestJS + Prisma(MySQL).

**저장소:** [github.com/Sikdorang/WithFestival-v2-backend](https://github.com/Sikdorang/WithFestival-v2-backend)

## 로컬 개발

1. `git clone https://github.com/Sikdorang/WithFestival-v2-backend.git`
2. `npm install`
3. `cp .env.example .env` 후 필요 시 수정
4. MySQL 준비 후 `npx prisma generate` → `npx prisma migrate deploy`
5. `npm run start:dev`

서버 실행 후 **Swagger UI:** `http://localhost:3000/docs` — 보호된 API는 **Authorize**에 로그인으로 받은 `accessToken` 값만 입력하면 됩니다(앞에 `Bearer ` 붙이지 않음).  
OpenAPI 데코·DTO 메타는 도메인별 `src/swagger/auth/`, `stores/`, `menus/` 에 두고, `compose`·문서 빌드·JWT 스키마 이름 등 공통은 `src/swagger/common/` 에 둡니다.

### 메뉴 등록 (JWT + 이미지)

`POST /menus` — `multipart/form-data`: 필드 `image`(파일), `name`, `price`(숫자), 선택 `description`. 스토어는 JWT `sub`의 `storeId`에 연결됩니다. S3에는 `menus/{storeId}/{uuid}.확장자` 형태로 올리고, DB `imageUrl`에는 객체의 HTTPS URL을 저장합니다.  
`PATCH /menus/:id` — 동일한 multipart 필드를 **보낸 것만** 반영(이미지·이름·가격·설명 선택).  
`DELETE /menus/:id` — **soft delete**(`deleted` → true, 기본 false). 활성 메뉴만 대상이며 성공 시 **204**.

## 컨테이너 (Podman / Docker)

프로젝트 루트에서 `podman compose up --build` (또는 `docker compose up --build`).  
호스트에서 Prisma CLI를 쓸 때는 `.env`의 `DATABASE_URL` 호스트 포트가 `compose.yaml`의 MySQL 포트 매핑(예: `13306`)과 같아야 합니다.  
`api` 컨테이너에서 메뉴 이미지 업로드를 쓰려면 같은 디렉터리의 `.env`에 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET` 이 채워져 있어야 합니다(compose가 변수로 주입).

## 최초 푸시 (이미 클론한 로컬 폴더에서)

```bash
git remote add origin https://github.com/Sikdorang/WithFestival-v2-backend.git
git branch -M main
git push -u origin main
```
