const express = require('express');
const imageRouter = express.Router();
const mongoose = require('mongoose');
const Image = require('../models/Image');
// var webOrder = require('../../models/WebOrder');

// const url = "mongodb://localhost:27017/mydb";
const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

connect.once('open', () => {
  // initialize stream
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: 'uploads',
  });
});

/*
      POST: Upload a single image/file to Image collection
  */
exports.uploadSingle = (req, res) => {
  Image.findOne({
    filename: req.body.filename,
  })
    .then((image) => {
      // console.log(image);
      if (image) {
        return res.status(200).json({
          success: false,
          message: 'Image already exists',
        });
      }

      let newImage = new Image({
        name: req.body.name,
        ts: req.body.ts,
        filename: req.file.filename,
        fileId: req.file.id,
      });

      newImage
        .save()
        .then((image) => {
          res.status(200).json({
            success: true,
            image,
          });
        })
        .catch((err) => res.status(500).json(err));
      return req.body.filename;
    })
    // .then((filename) => {
    //   webOrder
    //     .findOneAndUpdate(
    //       {
    //         DO: filename,
    //       },
    //       {
    //         fulfilled: true,
    //       }
    //     )
    //     .catch((err) => {
    //       // console.log(err)
    //     });
    // })
    .catch((err) => res.status(500).json(err));
};

exports.findUpload = (req, res) => {
  Image.find({})
    .then((images) => {
      res.status(200).json({
        success: true,
        images,
      });
    })
    .catch((err) => res.status(500).json(err));
};

/*
      GET: Delete an image from the collection
  */
exports.deleteID = (req, res) => {
  Image.findOne({
    _id: req.params.id,
  })
    .then((image) => {
      if (image) {
        Image.deleteOne({
          _id: req.params.id,
        })
          .then(() => {
            return res.status(200).json({
              success: true,
              message: `File with ID: ${req.params.id} deleted`,
            });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      } else {
        res.status(200).json({
          success: false,
          message: `File with ID: ${req.params.id} not found`,
        });
      }
    })
    .catch((err) => res.status(500).json(err));
};

/*
      GET: Fetch most recently added record
  */
exports.recent = (req, res) => {
  Image.findOne(
    {},
    {},
    {
      sort: {
        _id: -1,
      },
    }
  )
    .then((image) => {
      // console.log(image)
      res.status(200).json({
        success: true,
        image,
      });
    })
    .catch((err) => res.status(500).json(err));
};

//   /*
//         POST: Upload multiple files upto 3
//     */
exports.uploadMultiple = (req, res) => {
  Image.findOne({
    DO: req.body.DO,
  })
    .then((image) => {
      if (image) {
        return res.status(200).json({
          success: false,
          message: 'Images already exists',
        });
      }
      var filename = [],
        fieldid = [];

      for (var i in req.files) {
        filename.push(req.files[i].filename);
        fieldid.push(req.files[i].id);
      }
      let newImage = new Image({
        DO: req.body.DO,
        caption: req.body.caption,
        filename: filename,
        fileId: fieldid,
      });
      newImage
        .save()
        .then((image) => {
          res.status(200).json({
            success: true,
            message: `${req.files.length} files uploaded successfully`,
          });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};

/*
      GET: Fetches all the files in the uploads collection
  */
exports.allFiles = (req, res) => {
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No files available',
      });
    }

    files.map((file) => {
      if (
        file.contentType === 'image/jpeg' ||
        file.contentType === 'image/png' ||
        file.contentType === 'image/svg'
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
    });

    res.status(200).json({
      success: true,
      files,
    });
  });
};

/*
      GET: Fetches a particular file by filename
  */
exports.fileByFilename = (req, res) => {
  gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files[0] || files.length === 0) {
        return res.status(200).json({
          success: false,
          message: 'No files available',
        });
      }

      res.status(200).json({
        success: true,
        file: files[0],
      });
    });
};

/* 
      GET: Fetches a particular image and render on browser
  */
exports.imageByFilename = (req, res) => {
  gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files[0] || files.length === 0) {
        return res.status(200).json({
          success: false,
          message: 'No files available',
        });
      }

      if (
        files[0].contentType === 'image/jpeg' ||
        files[0].contentType === 'image/png' ||
        files[0].contentType === 'image/svg+xml'
      ) {
        // render image to browser
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image',
        });
      }
    });
};

/*
       DELETE: Delete a particular file by an ID
   */
exports.deleteFile = function (req, res) {
  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) {
      return res.status(404).json({
        err: err,
      });
    }

    res.status(200).json({
      success: true,
      message: `File with ID ${req.params.id} is deleted`,
    });
  });
};
