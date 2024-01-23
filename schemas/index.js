import mongoose from "mongoose";
import "dotenv/config";

const connect = () => {
  mongoose
    .connect(
      `mongodb+srv://bogiegie:${process.env.DB_PASS}@express-mongo.eng6mjr.mongodb.net/?retryWrites=true&w=majority`,
      {
        dbName: "node_lv1",
      },
    )
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

export default connect;
