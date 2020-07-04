const router = require("express").Router()
const {
  getPosts,
  createPost,
  getPostsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
} = require("../controllers/post")
const { requireSignin, checkAuth } = require("../controllers/auth")
const { userById } = require("../controllers/user")

router.route("/").get(getPosts)
router.route("/:userId").post(requireSignin, createPost)

router.route("/by/:userId").get(requireSignin, getPostsByUser)

router
  .route("/postId/:postId")
  .delete(requireSignin, isPoster, deletePost)
  .put(requireSignin, isPoster, updatePost)

router.param("userId", userById)
router.param("postId", postById)

module.exports = router
