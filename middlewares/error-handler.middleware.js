//에러처리 미들웨어에서 에러 처리 통합하기

export default (err, req, res, next) => {
  console.log("에러 처리 미들웨어가 실행되었습니다.");
  //전달 받은 에러 콘솔찍고
  console.error(err);
  // Joi로 유효성 검사에 걸리는 에러는 이렇게 출력하고,
  if (err.name === "ValidationError") {
    return res.status(400).send(err.datails[0].message);
  }
  // Joi에 잡히지 않는 예상치 못한 에러는 서버 에러로 상태코드와 에러메세지를 출력
  return res
    .status(500)
    .json({ errorMessage: "서버에서 에러가 발생했습니다." });
};
