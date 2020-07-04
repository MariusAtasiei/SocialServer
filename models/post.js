const mongo = require("mongoose")

const postSchema = new mongo.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    photo: { data: Buffer, contentType: String },
    postedBy: { type: String },
  },
  { timestamps: true }
)

module.exports = mongo.model("Posts", postSchema)
