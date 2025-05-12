import express from 'express'; // Use 'import' instead of 'require'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from './S3Client.js'; // Ensure that you use correct path if necessary

const router = express.Router()
router.post("/s3PutObject", async (req, res) => {
    const {formData} = req.body
    console.log(formData)
    const params = {
        Bucket:"squarescantestbuckduckula",
        Key:formData.itemKey | 123, 
        Body:formData.testText,
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
export default router