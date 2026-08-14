import { createUser, getUserByUsername } from "#db/queries/users";
import express from "express";
import requireBody from "../../guided/table4u/middleware/requireBody.js";
import { createToken } from "#utils/jwt";
const userRouter = express.Router();
export default userRouter;

userRouter.post("/register", requireBody(["username", "password"]), async (req, res) => {
  const user = await createUser(req.body.username, req.body.password);
  const token = createToken(user);
  res.status(201).send({ token: token });
});

userRouter.post("/login", requireBody(["username", "password"]), async (req, res) => {
  const user = await getUserByUsername(req.body.username, req.body.password);
  if (user) {
    const token = createToken(user);
    res.status(200).send({ token: token });
  } else {
    res.status(401).send("Invalid Creds");
  }
});
