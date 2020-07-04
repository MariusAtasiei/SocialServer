const mongo = require("mongoose")
const crypto = require("crypto")
const uuid = require("uuidv1")

const userSchema = new mongo.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    salt: String,
    followers: { type: Number, default: 0 },
    following: { type: Array },
    photo: {
      path: String,
      contentType: String,
    },
  },
  { timestamps: true }
)

userSchema.virtual("password").set(function (password) {
  this._password = password
  this.salt = uuid()
  this.hashedPassword = this.encryptPassword(password)
})

userSchema.methods = {
  authenticate: function (password) {
    return this.encryptPassword(password) === this.hashedPassword
  },
  encryptPassword: function (password) {
    if (!password) return ""

    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
    } catch (err) {
      return ""
    }
  },
}

module.exports = mongo.model("User", userSchema)
