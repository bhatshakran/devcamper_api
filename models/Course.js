const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    requried: [true, "Please add a course title"],
  },
  description: {
    type: String,
    requried: [true, "Please add a course description"],
  },
  weeks: {
    type: String,
    requried: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    requried: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    requried: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
