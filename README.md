## READ ME

### 프로젝트 개요

<aside>
💡 **Directory Structure: 폴더 구조**

</aside>

```bash
.
├── .env
├── .gitignore
├── .prettierrc.json
├── app.js
├── middlewares
│   └── error-handler.middleware.js
├── routes
│   └── products.router.js
├── schemas
│   ├── index.js
│   └── products.schema.js
├── document.txt
├── README.md
├── yarn.lock
├── package.json
└── package-lock.json

```

#### Q2. 대표적인 HTTP Method의 4가지 (GET, POST, PUT, DELETE)는 각각 어떤 상황에서 사용하였나요?

1. GET
   - URL(/api/products)로 접근하여 상품 전체 목록을 조회하는 상황에서 GET 메서드를 사용했습니다. 요청한 데이터를 req.query로 전달 받아 내림차순 정렬을 적용하고 JSON 형태의 데이터를 반환하도록 구현하였습니다.
   - URL(/api/products/:productsId)로 접근하여 상세 정보를 조회하는 상황에서도 GET 메서드를 사용했으며, productsId라는 경로 변수를 req.params로 전달 받아 요청한 Id의 데이터를 반환할 수 있도록 구현하였습니다.
2. POST
   - URL(/api/products) 접근한 사용자가 새 상품을 등록해야하는 상황에서 POST 메서드를 사용했습니다. 데이터 유효성 검사을 위해 사용한 라이브러리, Joi의 validateAsync() 메서드를 사용하여 유효성 검사를 거치고 new 키워드로 인스턴스화하여 생성된 body 데이터를 전달 받아 반환하도록 구현하였습니다.
3. PATCH
   - URL(/api/products/productsId) 경로로 접근한 사용자가 해당 상품 판매 글의 작성 내용과 판매 상태를 수정할 수 있도록 하기 위해, PATCH 메서드를 사용하였습니다. 사용자가 입력한 body 데이터를 전달 받아 유효성 검사와 비밀번호 일치 여부를 확인한 뒤, 수정 정보를 DB에 저장하면서 수정완료/실패 여부를 JSON 형태의 메세지로 반환하도록 하였습니다.
4. DELETE
   - URL(/api/products/productsId) 경로로 접근하여 판매 게시글을 삭제하려는 상황일 때DELETE 메서드를 사용하였습니다. Id 값은 req.params로, password는 req.body에서 전달 받아 비밀번호 일치 여부에 따라 삭제하고 실패시 비밀번호가 일치하지 않는다는 메세지를 JSON 형태로 반환하도록 하였습니다.

#### Q3. API 설계 시 RESTful한 원칙을 따랐나요? 어떤 부분이 RESTful한 설계를 반영하였고, 어떤 부분이 그렇지 않았나요?

~/routes/products.router.js 파일에서 HTTP 메서드인 POST, GET, PATCH, DELETE로 각각 리소스를 생성/조회/수정/삭제하는 역할을 담당하게 하여, 요청을 보낸 클라이언트에게 처리된 결과를 JSON 형식으로 반환하게 하였습니다. 각각 정의한 라우터들이 요청과 응답을 하는 과정에서 중복되는 로직들이 많았고, 코드의 가독성과 재사용성을 높이기 위해 중복되는 로직은 전역 스코프로 분리하는 방법을 고민하였습니다.

#### Q4. 폴더 구조(Directory Structure)를 역할 별로 분리하였다면, 어떤 이점을 가져다 주었을까요?

분리된 라우터와 미들웨어, 몽고DB 스키마 등 잘 정리된 폴더 구조의 이점은, 각각의 역할을 명확하게 인지할 수 있는 이점이 가장 컸던 것 같습니다. 역할에 따라 폴더와 파일을 구분하여 특정 함수와 변수를 찾고, 수정하기 용이한 장점이 있는 것 같습니다. 복잡한 구조를 가진 프로그램을 설계할 때에는 반드시 폴더 구조를 처음부터 고려해야 효율적이고 유지보수가 쉬운 코드를 짜면서 협업할 수 있을 것 같습니다.

#### Q5. mongoose에서 상품 상태는 어떠한 방식으로 관리하였나요? 이 외에도 어떤 방법들이 있었을까요?

products.schema.js 파일에서 스키마를 설계할 때 특정 필드에 대한 value를 제한하는 ‘enum’을 사용하여 판매 중(FOR_SALE)을 default로 설정하고, 판매 중과 판매 완료(SOLD_OUT) 상태 외에 다른 value를 입력하면 에러 메세지를 출력하도록 하였습니다. 판매 준비 중, 판매 불가 등 추가되는 상태가 있을 수도 있는 상황을 고려하여 해당 파일에서 관리될 수 있도록 하는 방법을 선택했습니다. 이 외에 Boolean으로 처리하거나, joi 스키마에서 valid() 메서드를 사용하는 방법이 있었습니다.

#### 과제 하면서 어려웠던 기술적인 부분을 적어주세요.

Mongoose ODM과 라이브러리 Joi로 유효성 검사를 했는데, 적절하게 활용하지 못한 것 같습니다. 여기저기서 유효성 검사를 하고, 스키마 네이밍 또는 검사 조건이나 로직을 변경하였을 때 어디에서 검사를 진행하고 에러를 출력하는지 구분하는데 어려움이 있었습니다. 특히 에러 핸들러 미들웨어와 어떻게 연결하는지 명확하게 이해하지 못한 것 같습니다.
