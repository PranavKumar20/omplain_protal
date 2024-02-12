const express = require("express");
const zod = require("zod");
const { Complains} = require("../db")
const { authMiddleware } = require("../middleware");

const router = express.Router();

const createComplainBody = zod.object({
    title: zod.string().min(1).max(255),
    description: zod.string().min(1).max(1000),
    topics: zod.array(zod.string()),
    complainStatus: zod.enum(['open', 'close']).default('open'),
    // complainStatus:zod.string(),
    canBeAnsweredBy: zod.array(zod.string()),
})

router.post("/createcomplain", authMiddleware, async (req, res) => {
    const { success } = createComplainBody.safeParse(req.body);
    if (!success) return res.status(403).json({ msg: "invalid inputs" });
    try {
        const complain = await Complains.create({
            title: req.body.title,
            description: req.body.description,
            topics: req.body.topics,
            complainStatus: req.body.complainStatus,
            canBeAnsweredBy: req.body.canBeAnsweredBy,
            userId: req.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        res.json({ msg: "Complain created successfully" });
    } catch (error) {
        console.log(error);
        req.status(500).josn({ msg: "Internal server error" });
    }
})

const updateComplainBody = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    topics: zod.array(zod.string()).optional(),
    complainStatus: zod.enum(['open', 'close']).optional(),
    canBeAnsweredBy: zod.array(zod.string()).optional(),
})

router.put("/updatecomplain", authMiddleware, async (req, res) => {
    const complainId = req.query.complainid;

    try {
        const existingComplain = await Complains.findOne({
            _id: complainId,
            userId: req.userId,
        });

        if (!existingComplain) {
            return res.status(404).json({ msg: "Complaint not found or unauthorized" });
        }
        const { success } = updateComplainBody.safeParse(req.body);
        if (!success) {
            return res.status(403).json({ msg: "Invalid inputs" });
        }
        // existingComplain.title = req.body.title;
        // existingComplain.description = req.body.description;
        // existingComplain.topics = req.body.topics;
        // existingComplain.complainStatus = req.body.complainStatus;
        // existingComplain.canBeAnsweredBy = req.body.canBeAnsweredBy;
        // existingComplain.updatedAt = new Date();
        // await existingComplain.save();
        const updateComplain = await Complains.updateOne(req.body,{
            _id:complainId,
            userId:req.userId
        })
        console.log(updateComplain);
        res.json({ msg: "Complaint updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.get("allcomplains", async(req,res)=>{
    try{
        const allcomplains = await Complains.find({});
        if(!allcomplains) return res.status(403).json({msg:"something went wrong"});
        res.json({
            msg:"compalains retieved successfully",
            complains:allcomplains
        })
    }catch(error){
        console.log(error);
        res.status(411).json({msg:"something went wrong"});
    }
})

router.delete("/deletecomplain",authMiddleware, async(req,res)=>{
    const complainId = req.query.complainid;
    try{
        const existingComplain = await Complains.findOne({
            _id:complainId,
            userId:req.userId
        })
        if(!existingComplain) return res.status(403).json({msg:"Complain you want to delete not found"});
        await existingComplain.remove();
        res.json({msg:"Complain deleted Successfully"});
    }catch(error){
        console.log(error);
        res.status(411).josn({msg:"Something went wrong"});
    }
})

module.exports = router;