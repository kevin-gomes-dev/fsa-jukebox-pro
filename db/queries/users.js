import db from "#db/client";
import bcrypt from "bcrypt";

// Register
export async function createUser(username, password) {
  const sql = `INSERT INTO users (username,password) VALUES ($1,$2) RETURNING *`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

// Login
export async function getUserByUsername(username, password) {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return false;
  const verified = await bcrypt.compare(password, user.password);
  if (verified) return user;
  return false;
}

// Good login
export async function getUserById(id) {
  const SQL = `SELECT * FROM users WHERE id = $1 `;
  const {
    rows: [user],
  } = await db.query(SQL, [id]);
  return user;
}
