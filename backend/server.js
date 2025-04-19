import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import cors from "cors";

const app = express();
dotenv.config();

const port = process.env.PORT || 4000;
const sql = neon(process.env.DATABASE_URL);

app.use(express.json());
app.use(cors());

// Function to initialize the database (create the table)
// async function initializeDatabase() {
//   try {
//     const pulledData = await sql`
//   SELECT * FROM userbase.users;`;
//     console.log("Data pulled: ", pulledData);
//   } catch (error) {
//     console.error("Error pulling data: ", error);
//   }
// }
// Initialize the database
// initializeDatabase();

const checkUser = async (user, pass) => {
  try {
    const result =
      await sql`SELECT * FROM userbase.users WHERE email = ${user}`;
    if (result.length === 0) {
      return false; // No user found
    }
    console.log("Stored hash:", result[0].password, "password:", pass);
    const cryptCheck = await bcrypt.compare(
      pass.trim(),
      result[0].password.trim()
    ); // Use result[0] to access the first user
    return cryptCheck;
  } catch (err) {
    console.error("Database error during checkUser:", err);
    return false;
  }
};

const signUpUser = async (email, password) => {
  try {
    const encryptedpass = await bcrypt.hash(password, 10); // Make sure to await bcrypt.hash
    await sql`
      INSERT INTO userbase.users(email, password, created_at) 
      VALUES (${email}, ${encryptedpass}, NOW())
    `;
    console.log("User created");
    return true; // Return a result indicating success
  } catch (e) {
    console.log("Error: " + e);
    return false; // Return false in case of an error
  }
};
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

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port" + port);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(
    `User (${email}) attemped to log in using password (${password})`
  );
  const isValid = await checkUser(email, password);
  if (isValid) {
    console.log(`User '${email}' is logged in!`);
    res.json({ success: true, message: "Login successful" });
  } else {
    console.log("Log in denied");
    res.json({ success: false, message: "Login failed" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const signup = await signUpUser(email, password); // Now this will work as expected

  if (signup) {
    res.json({
      success: true,
      message: "Account created successfully",
    });
  } else {
    res.json({
      success: false,
      message: "Account creation failed",
    });
  }
});

app.post("/projectpull", async (req, res) => {
  try {
    const { userid } = req.body;
    const query =
      await sql`SELECT * FROM userbase.projects WHERE creator_id = ${userid}`;
    console.log(query);
    console.log("projects: ", query);
    res.json({ query: query });
  } catch (e) {
    console.log("error: ", e);
  }
});
