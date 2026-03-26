const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {

  const folder = path.join(__dirname, "..", "uploads", "beneficios");

  if (!fs.existsSync(folder)) {
    return res.json([]);
  }

  const files = fs.readdirSync(folder);

  const beneficios = files.map(file => ({
    name: file,
    url: `/uploads/beneficios/${file}`
  }));

  res.json(beneficios);

});

module.exports = router;