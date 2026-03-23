const router = require("express").Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find().select("name email");
  res.json(users);
});

module.exports = router;