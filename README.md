## RESTful API Project

### 01.21 REST API 만들기 과제 시작

- 목표

  - 자아 버리고 무조건 기한 안에 요구사항 구현/충족
    - 프로젝트 요구사항 충족
    - REST 원칙에 따른 API 구현에 집중
    - Thunder Client로 단위 테스트하면서 넘어가기
    - AWS EC2 배포와 도메인 연결
  - 여유가 된다면, 해보면 좋을 것들
    - Swagger UI, API 명세 확인할 수 있게 연동해보기
    - Mongoose ODM 배웠으니 Sequelize ORM도 해봐야겠지?

- 오늘 할일
  - ✔️ Github Repository 생성 후 첫 커밋
  - ✔️ 기본 세팅
    - README 생성 후 프로젝트 개요 작성
    - .gitignore (dotenv, node_modules)
    - .prettierrc.json
    - yarn
    - ESM module
    - Directory Structure
  - ✔️ Express 서버 만들기 & 기본 서버 세팅
  - ✔️ 미들웨어 등록 (body-parser / Log / error-handler)
  - ✔️ /api GET 요청 TEST
  - ✔️ MongoDB 연결 -> connect()
  - ✔️ Mongoose 스키마 설계&모델 생성
  - ✔️ 라우터 미들웨어 등록
  - CRUD 구현 시작-
    - ✔️ Create / 상품 등록 API 구현 및 TEST
    - ✔️ Read / 상품 목록 전체 조회 및 상세 조회 API 구현 및 TEST
    - 01.22 AM 02:12 Commit&push
      - 내일 할일
        - 에러 처리 및 Joi 연결 더 자연스럽게..
        - Update API 구현 및 TEST
        - 15시까지 최대한 리펙터링에 집중
        - 이후 AWS EC2 배포와 도메인 연결 학습 및 적용
