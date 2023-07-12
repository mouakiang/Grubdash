const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed)

router.route("/:dishId")
.get(controller.read)
.all(methodNotAllowed)


module.exports = router;

