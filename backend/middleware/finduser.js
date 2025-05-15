import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function checkUser(user, password) {
  try {
    const result = await sql`SELECT * FROM userbase.users WHERE email = ${user.email}`;
    if (result.length === 0) {
      return false; // No user found
    }
    console.log("Stored hash:", result[0].password, "password:", password);
    const cryptCheck = await bcrypt.compare(
      password.trim(),
      result[0].password.trim()
    );
    return cryptCheck;
  } catch (err) {
    console.error("Database error during checkUser:", err);
    return false;
  }
}
