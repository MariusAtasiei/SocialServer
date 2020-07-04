const router = require("express").Router()
const userController = require("../controllers/user")
const { requireSignin } = require("../controllers/auth")

router.get("/", userController.getUsers)

router.get("/username=:username", userController.getUser)

router
  .route("/id=:userId")
  .post(userController.updateUser)
  .delete(userController.deleteUser)

router.post("/confirm-password", userController.confirmPassword)
router.post("/upload-photo/:userId", userController.uploadProfilePhoto)
router.post("/follow/:userId", userController.follow)
router.get("/photo/:userId", userController.profilePhoto)

router.get("/find", userController.getUserByName)

router.param("userId", userController.userById)

module.exports = router
