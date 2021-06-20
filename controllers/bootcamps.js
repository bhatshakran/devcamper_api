// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.json({ success: true, message: "Get all bootcamps" });
};

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res.json({ success: true, message: "get bootcamp by id" });
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res.json({ success: true, message: "Update a bootcamp" });
};

// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = (req, res, next) => {
  res.json({ success: true, message: "Create new bootcamp" });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res.json({ success: true, message: "Delete a bootcamp" });
};
