# WithFestival v2 — Backend

NestJS + Prisma(MySQL).

**저장소:** [github.com/Sikdorang/WithFestival-v2-backend](https://github.com/Sikdorang/WithFestival-v2-backend)

## 로컬 개발

1. `git clone https://github.com/Sikdorang/WithFestival-v2-backend.git`
2. `npm install`
3. `cp .env.example .env` 후 필요 시 수정
4. MySQL 준비 후 `npx prisma generate` → `npx prisma migrate deploy`
5. `npm run start:dev`

## 컨테이너 (Podman / Docker)

프로젝트 루트에서 `podman compose up --build` (또는 `docker compose up --build`).  
호스트에서 Prisma CLI를 쓸 때는 `.env`의 `DATABASE_URL` 호스트 포트가 `compose.yaml`의 MySQL 포트 매핑(예: `13306`)과 같아야 합니다.

## 최초 푸시 (이미 클론한 로컬 폴더에서)

```bash
git remote add origin https://github.com/Sikdorang/WithFestival-v2-backend.git
git branch -M main
git push -u origin main
```
