const Post = require("../models/post")
const formidable = require("formidable")
const fs = require("fs")
const { extend } = require("lodash")

exports.postById = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id)
    req.post = post
    next()
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("-__v")
      .populate("postedBy", "_id name")
    return res.json(posts)
  } catch (err) {
    return res.json({ error: err.message })
  }
}

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id name")
      .sort("createdAt")
    return res.json(posts)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

exports.createPost = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.keepExtension = true
  form.parse(req, async (fields, files) => {
    try {
      let post = new Post(fields)

      post.postedBy = req.profile
      post.postedBy.salt = undefined
      post.postedBy.hashedPassword = undefined
      post.postedBy.__v = undefined

      if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path)
        post.photo.contentType = files.photo.type
      }
      await post.save()
      res.json({ post })
    } catch (err) {
      res.status(400).json({ error: "Image could not be uploaded." })
    }
  })
}

exports.isPoster = (req, res, next) => {
  const isPoster = req.post && req.auth && req.auth._id == req.post.postedBy._id

  if (!isPoster)
    return res
      .status(403)
      .json({ error: "User not authorized to delete this post." })
  next()
}

exports.deletePost = async (req, res) => {
  const { post } = req
  try {
    await post.remove()
    return res.json({ message: "The post was successfully deleted." })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

exports.updatePost = async (req, res, next) => {
  const post = extend(req.post, req.body)

  try {
    await post.save()
    res.json({ message: "Post updated successfully." })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
