import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "./jwt/gentoken.js";
import { neon } from "@neondatabase/serverless";
export default async function checkUser(user) {
      try {
        const result =
          await sql`SELECT * FROM userbase.users WHERE email = ${user.email}`;
        if (result.length === 0) {
          return false; // No user found
        }
        console.log("Stored hash:", result[0].password, "password:", password);
        const cryptCheck = await bcrypt.compare(
          password.trim(),
          result[0].password.trim()
        ); // Use result[0] to access the first user
        return cryptCheck
      } catch (err) {
        console.error("Database error during checkUser:", err);
        return false;
      }
}