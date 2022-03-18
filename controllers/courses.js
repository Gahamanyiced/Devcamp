const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp');
const { trusted } = require('mongoose');

// @ Desc Get courses
// @ Route GET /api/v1/courses
// @ Route GET /api/v1/bootcamps/:bootcampId/courses
// @ Access Public
exports.getCourses = asyncHandler(async(req,res,next)=>{
    let query;
    console.log(req.params.bootcampId)
    if (req.params.bootcampId){
       query = Course.find({bootcamp: req.params.bootcampId});

    } 
    else {
        query = Course.find().populate({
            path:'bootcamp',
            select:'name description'
        });
    }
    const courses = await query;
    res.status(200).json({
        success:true,
        count: courses.length,
        data: courses
    });

});
// @ Desc Get single courses
// @ Route GET /api/v1/courses
// @ Access Private
exports.getCourse = asyncHandler(async(req,res,next)=>{
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'});
    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404)
    }
    
    res.status(200).json({
        success:true,
        data: course
    });

});
// @ Desc Add course
// @ Route POST /api/v1/bootcamps/:bootcampId/courses
// @ Access Private
exports.addCourse = asyncHandler(async(req,res,next)=>{
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
      next(new ErrorResponse(`No Bootcamp with the id ${req.params.bootcampId}`),404);
    }
    const course = await Course.create(req.body)
    res.status(200).json({
        success:true,
        data: course
    });

});
// @ Desc Update course
// @ Route PUT /api/v1/courses/:id
// @ Access Private
exports.updateCourse = asyncHandler(async(req,res,next)=>{
    
    let course = Course.findById(req.params.id);
    if(!course){
      next(new ErrorResponse(`No course with the id ${req.params.id}`),404);
    }
     course = await Course.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true
        });
    res.status(200).json({
        success:true,
        data: course
    });

});
// @ Desc Delete course
// @ Route DELETE /api/v1/courses/:id
// @ Access Private
exports.deleteCourse = asyncHandler(async(req,res,next)=>{
    
    const course = Course.findById(req.params.id);
    if(!course){
      next(new ErrorResponse(`No course with the id ${req.params.id}`),404);
    }
    await Course.remove();
    res.status(200).json({
        success:true,
        data: {}
    });

});