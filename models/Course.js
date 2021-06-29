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


// Static method to get avg of course tuitions
courseSchema.statics.getAverageCost = async function(bootcampId){
  console.log('Calculating avg cost...'.blue);

  const obj = await this.aggregate([
    {
      $match: {bootcamp: bootcampId}
    },
    {
      $group:{
        _id: '$bootcamp',
        averageCost: {$avg : '$tuition'}
      }
    }
  ])
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost/10) * 10
    })
    
  } catch (err) {
    console.error(err)
  }
}

// Call getAverageCost after save
courseSchema.post('save', function() {
  this.constructor.getAverageCost(this.bootcamp);
})


// Call getAverageCost before remove
courseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model("Course", courseSchema);
