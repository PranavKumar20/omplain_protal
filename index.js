const express = require("express");
const cors = require("cors");
const rootRouter = require("./router/index");

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

//https://youtube.com/playlist?list=PLEvcarIxZ3jMOTa5PxiCYbvkWCjx1mgwV&si=Wxfu-8a6xLJM1m2X
