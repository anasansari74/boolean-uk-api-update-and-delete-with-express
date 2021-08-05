const express = require("express");

const { getAll, getOne, createOne, patchById } = require("./controller");

const router = express.Router();

router.get("/", getAll);

router.get("/:id", getOne);

router.post("/", createOne);

router.patch("/:id", patchById);

module.exports = router;
