import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import cors from "cors";
import fs from 'fs'
import path from 'path'
import s3PutRoute from "./aws/s3PushObject.js";
import checkUser from "./middleware/finduser.js"
import { generateAccessToken, generateRefreshToken } from "./jwt/gentoken.js";
import checkRefreshToken from "./jwt/checkrefreshtoken.js";
import checkAccessToken from "./jwt/checkaccesstoken.js";
import signUpUser from "./middleware/signupuser.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
const sql = neon(process.env.DATABASE_URL);
app.use(express.json());
app.use(cors());
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Basic route for testing
app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).send(`PostgreSQL Version: ${version}`);
  } catch (error) {
    res.status(500).send("Error fetching database version.");
  }
});
app.post("/login", async (req, res) => {
  try {const { email, password } = req.body;
  console.log(
    `User (${email}) attemped to log in using password (${password})`
  );
  const isValid = await checkUser({email:email, password:password});
  if (isValid) { //basic login user check
    const hasRefreshToken = checkRefreshToken(email) 
    if (!hasRefreshToken) {
      await generateRefreshToken(email)
    }
    console.log(`User '${email}' is logged in!`);
    const accessToken = generateAccessToken(email)
    res.json({ success: true, message: "Login successful", accessToken:accessToken });
    console.log("Access Token: ", accessToken);
  } else {
    console.log("Log in denied");
    res.json({ success: false, message: "Login failed" });
  }}
  catch (e) {
    console.log("Error in log in route: ", e)
  }
  
});
app.post("/gat", async (req, res) => {
  const {email} = req.body
  return generateAccessToken(email)
})
app.post("/signup", async (req, res) => {
  const { email, password, verifypassword} = req.body;

  const signup = await signUpUser(email, password, verifypassword); // Now this will work as expected

  if (signup) {
    res.json({
      success: true,
      message: "Account created successfully",
    });
  } else {
    res.json({
      success: false,
      message: "Account creation failed, invalid email or password",
    });
  }
});

app.post("/projectpull", async (req, res) => {
  try {
    const { user_email } = req.body;
    const query =
      await sql`SELECT * FROM userbase.projects INNER JOIN userbase.addresses ON projects.project_id = userbase.addresses.project_id WHERE userbase.projects.creator_id = (SELECT user_id FROM userbase.users WHERE users.email = ${user_email})`;
    res.json({ query: query });
  } catch (e) {
    console.log("error: ", e);
  }
});

app.post("/projectpush", async (req, res) => {
  try {
    const { project_name, creator_email, address } = req.body;
    console.log("Received body:", req.body);
    const [user] = await sql`
  SELECT user_id FROM userbase.users WHERE email = ${creator_email}
`;

    if (!user) {
      throw new Error("Creator email not found");
    }

    // Step 2: Insert into projects using the retrieved user_id
    const [project] = await sql`
  INSERT INTO userbase.projects (project_name, creator_id, created_at, cover_photo)
  VALUES (${project_name}, ${
      user.user_id
    }, NOW(), ${`https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(
      address || "The Empire State Building"
    )}&key=${process.env.GOOGLE_STATIC_KEY}`}
)
  RETURNING project_id
`;
    const projectid = project.project_id;
    console.log("project id: ", projectid);
    // Step 3: Use the new project_id in a related insert
    await sql`
  INSERT INTO userbase.addresses (project_id, address)
  VALUES (${projectid}, ${address})
`;
    res.status(201).json({ message: "Project created successfully!" });
  } catch (e) {
    console.log("error: ", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});
app.post("/grabaccountinfo", async (req, res) => {
  try {
    const { userEmail } = req.body;
    console.log(userEmail);
    const query =
      await sql`SELECT * FROM userbase.users WHERE users.email = ${userEmail}`;
    res.status(500).json({ data: query });
  } catch (e) {
    console.log("error in grabaccount server side:", e);
  }
});

app.post("/reviewpush", async (req, res) => {
  try{
    const {poster_id, review} = req.body
    await sql`
    INSERT INTO userbase.reviews (poster_id, review)
    VALUES (
      (SELECT user_id FROM userbase.users WHERE email = ${poster_id}),
      ${review}
    )
  `;
    res.status(201).json({message:"Review successfully created"})
  }
  catch (e) {
    res.status(500).json({message:e})
  }
});
app.post("/reviewpull", async (req, res) => {
  try {
    const reviews = await sql`SELECT * FROM userbase.reviews`
    res.status(201).json({reviews:reviews}) }
  catch (e) {
    console.log("Error in review pull function: ", e)
  }
})
app.post("/cleardata", async (req, res) => {
  try {
    const { userEmail } = req.body;
    console.log("useremail = ", userEmail);
    const deleteQuery =
      await sql`DELETE FROM userbase.projects WHERE creator_id IN (SELECT user_id FROM userbase.users WHERE email = ${userEmail});`;
    res.status(200).json({ message: "Successful delete" });
    console.log("deleted");
  } catch (e) {
    console.log("Error in delete server side: ", e);
    res.status(500).json({ message: "Delete failed" });
  }
});
app.post("/deleteproject", async (req,res) => {
  try {
    const {project_id} = req.body
    const deletion = await sql`DELETE FROM userbase.projects WHERE project_id = ${project_id}`
    res.status(200).json({message:"Project successfully deleted"})
  }
  catch (e) {
    console.log("Error in project delete server side: ", e)
  }
})
app.post("/s3PutObject", s3PutRoute)
app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port" + port);
});
