const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables
const port = process.env.PORT || 4000;
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const cors = require("cors");
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
      await sql`SELECT * FROM userbase.users WHERE email = ${user} AND password_hash = ${pass}`;
    return result.length > 0; // <-- only returns true if a match is found
  } catch (err) {
    console.error("Database error during checkUser:", err);
    return false;
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
  } else {
    console.log("Log in denied");
  }
});
