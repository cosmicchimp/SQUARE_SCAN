async function s3PutObject(formData) {
    try {
        await fetch("https://square-scan.onrender.com/s3PutObject", {
            method:"POST",
            body:formData
        })
    }
    catch (e) {
        console.log("Error in the frontend s3 put object function", e)
    }
}
export default s3PutObject