const express = require("express");
const zod = require("zod");
const {Users, Complains, Replies} = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {authMiddleware} = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string().min(8)
})

router.post("/signup",async (req,res)=>{
    const { success } = signupBody.safeParse(req.body);
    if(!success){
        return res.status(403).json({
            msg:"Invalid Inputs"
        })
    }
    const existingUser = await Users.findOne({
        username:req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            msg:"Credentails already taken"
        })
    }
    const user = await Users.create({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:req.body.password
    })

    const UserId = user._id;

    const token = jwt.sign({UserId},JWT_SECRET);
    res.json({
        msg:"Signup Successful",
        token:token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8)
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
        return res.status(403).json({
            mgs: "Incorrect Inputs"
        })
    }

    const user = await Users.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.status(200).json({
            token: token
        })
    }
    res.status(411).json({
        msg: "error while loggging in"
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "Error while updating information"
        })
    }

    await Users.updateOne(req.body, {
        _id: req.userId
    })

    res.status(200).json({
        msg: "Updated Successfully"
    })
})

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await Users.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.get("/profile", authMiddleware, async (req, res) => {
    const user = await Users.findOne({
        _id: req.userId
    })
    if(!user) return res.status(403).json({msg:"profile not found"});
    res.json({
        msg:"user found",
        user: user
    })
})

router.get("/mycomplains",authMiddleware, async(req,res)=>{
    const myComplains = await Complains.FindById(req.userId);
    if(!myComplains) return res.status(404).json({
        msg:"Not able to fetch your complains right now"
    })
    res.json({
        myComplains:myComplains
    })
})

router.get("/myreplies",authMiddleware, async(req,res)=>{
    const myReplies = await Replies.FindById(req.userId);
    if(!myReplies) return res.status(404).json({
        msg:"Not able to fetch your Replies right now"
    })
    res.json({
        myReplies:myReplies
    })
})

module.exports = router;
