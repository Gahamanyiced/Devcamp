const Bootcamp = require('../models/Bootcamp')
// @ Desc Get all bootcamps
// @ Route GET /api/v1/bootcamps
// @ Access Public
exports.getBootcamps=  ((req,res,next)=>{
   
    res.status(200).json({
        success:true,mess:'show all bootcamps'
    })
});
// @ Desc Get single bootcamp
// @ route GET /api/v1/bootcamps/:id
// @ Access Private
exports.getBootcamp=(req,res,next)=>{
    res.status(200).json({
        success:true,mess:`show bootcamp ${req.params.id}`
    })
};

// @ Desc create all bootcamps
// @ Route POST /api/v1/bootcamps
// @ Access Private
exports.createBootcamp= async(req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,data: bootcamp
        });   
    } catch (err) {
     res.status(400).json({
         success:false
     })   
    }
   
};

// @ Desc update single bootcamp
// @ route UPDATE /api/v1/bootcamps/:id
// @ Access Private
exports.updateBootcamp=((req,res,next)=>{
    res.status(200).json({
        success:true,mess:`update bootcamp ${req.params.id}`
    })
});

// @ Desc delete single bootcamp
// @ route DELETE /api/v1/bootcamps/:id
// @ Access Private
exports.deleteBootcamp=((req,res,next)=>{
    res.status(200).json({
        success:true,mess:`delete bootcamp ${req.params.id}`
    })
});

