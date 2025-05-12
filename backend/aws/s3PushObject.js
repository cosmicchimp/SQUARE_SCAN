const express = require('express')
const { PutObjectCommand } = require("@aws-sdk/client-s3")
const s3 = require("./S3Client")

const router = express.Router()
router.post("/s3PutObject", async (req, res) => {
    const {testText, itemKey} = req.body
    const params = {
        Bucket:"squarescantestbuckduckula",
        Key:itemKey, 
        Body:testText,
        ContentType:"text/plain"
    }
    try {
        await s3.send(new PutObjectCommand(params))
        res.status(201).json({success:true})
    }
    catch (e) {
        console.log("Error in the s3 put object functions", e)
        res.status(500).json({success:false})

    }
})
module.exports = router
