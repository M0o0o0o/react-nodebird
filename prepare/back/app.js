const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./models");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const hpp = require('hpp')
const helmet = require('helmet')
const passportConfig = require("./passport");
const passport = require("passport");

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();
if (process.env.NODE_ENV === 'production') {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: ["http://localhost:3000", 'nodebird.com', 'http://13.125.174.219'],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});
app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

// app.use((err, req, res, next) => {});

app.listen(80, () => {
  console.log("server starging");
});
