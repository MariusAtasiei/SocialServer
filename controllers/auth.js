const User = require("../models/user")
const jwt = require("jsonwebtoken")
const { token } = require("morgan")
const eJWT = require("express-jwt")

exports.signup = async (req, res) => {
  try {
    const { email } = req.body

    const newUser = await User.create(req.body)

    await newUser.save()

    const { _id, name, username } = await User.findOne({ email })
    const token = jwt.sign({ _id }, process.env.JWT_KEY)

    res.cookie("t", token)

    return res.json({ token, user: { _id, email, name, username } })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    console.log(user)
    if (!user.authenticate(password) || !user)
      throw new Error("Username or password invalid.")

    const { _id, name, email, following } = user
    const token = jwt.sign({ _id }, process.env.JWT_KEY)

    res.cookie("t", token)

    return res.json({ token, user: { _id, email, name, username, following } })
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
}

exports.signout = async (req, res) => {
  res.clearCookie("t")
  return res.json({
    message: "Signed out successfully.",
  })
}

exports.requireSignin = eJWT({
  secret: process.env.JWT_KEY,
  userProperty: "auth",
})
