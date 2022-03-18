const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const cloudinary = require('cloudinary').v2;
const cloudinaryUpload = require('../utils/cloudinary');

const path = require('path');

// @ Desc Get all bootcamps
// @ Route GET /api/v1/bootcamps
// @ Access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  //console.log(reqQuery);

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators($gt,$gte,etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding Resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  console.log(total);

  query = query.skip(startIndex).limit(limit);

  //Executing the query
  const bootcamp = await query;

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination: pagination,
    data: bootcamp,
  });
});
// @ Desc Get single bootcamp
// @ route GET /api/v1/bootcamps/:id
// @ Access Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  console.log(`parameter ${req.params.Id}`);
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @ Desc create all bootcamps
// @ Route POST /api/v1/bootcamps
// @ Access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @ Desc update single bootcamp
// @ route UPDATE /api/v1/bootcamps/:id
// @ Access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @ Desc delete single bootcamp
// @ route DELETE /api/v1/bootcamps/:id
// @ Access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @ Desc Get bootcamps within a radius
// @ route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @ Access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radius
  //Divide dist by radius of Earth
  //Earth Radius = 3,963 mi /6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @ Desc Upload photo for bootcamp
// @ route PUT /api/v1/bootcamps/:id/photo
// @ Access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `,
        400
      )
    );
  }

  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    if (err) {
      return next(new ErrorResponse(`Problem with uploading the image `, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: result.secure_url,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
