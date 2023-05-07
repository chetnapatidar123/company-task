const mongoose = require("mongoose")

const userModel = new mongoose.Schema({

    name: String,
    email: String,
    contact: String,
    task: String,
    status: String,
})

const user =mongoose.model("user", userModel)
module.exports = user;