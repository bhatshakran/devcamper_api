const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },

    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },

    careers: {
      //   Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpeg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create bootcamp slug from name
BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

// Geocode & create location field
BootcampSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);

this.location = {
    type:'Point',
    coordinates:[loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street:loc[0].streetName,
    city:loc[0].city,
    state:loc[0].state,
    zipcode:loc[0].zipcode,
    country:loc[0].countryCode
}


// Do not save address in DB
this.address = undefined;
  next()
})


// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
  console.log(`Courses being removed from bootcamp ${this._id}`)
  await this.model('Course').deleteMany({bootcamp: this._id})
  next()
})

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref:'Course',
  localField:'_id',
  foreignField: 'bootcamp',
  justOne: false
})



module.exports = Bootcamp = mongoose.model("Bootcamp", BootcampSchema);
