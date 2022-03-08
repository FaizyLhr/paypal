let router = require("express").Router();

router.use("/users", require("./users"));
router.use("/schools", require("./schools"));
router.use("/category", require("./category"));
router.use("/subject", require("./subjects"));
router.use("/topic", require("./topics"));
router.use("/planner", require("./planner"));
router.use("/public", require("./public"));
router.use("/upload", require("./upload"));

module.exports = router;
