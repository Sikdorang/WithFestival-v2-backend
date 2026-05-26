-- 스토어 공지 다국어(영/중/일) 컬럼 추가. 모두 `Text` nullable (한국어 `notice` 저장 시 자동 번역값 동시 갱신용).
ALTER TABLE `Store`
  ADD COLUMN `noticeEn` TEXT NULL,
  ADD COLUMN `noticeZh` TEXT NULL,
  ADD COLUMN `noticeJa` TEXT NULL;
