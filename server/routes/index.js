const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({response: "yoo wassup how ya doing"}).status(200);
});

module.exports = router;