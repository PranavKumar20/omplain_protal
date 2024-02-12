const express = require("express");
const userRouter = require("./user");
const replyRouter = require("./reply");
const complainRouter = require("./complain")

const router = express.Router();

router.use("/user",userRouter);
router.use("/reply",replyRouter);
router.use("/complain",complainRouter);

module.exports=router;