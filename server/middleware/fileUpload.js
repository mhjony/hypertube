// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

import multer from "multer";
import fs from "fs";
import path from "path";

const userFile = ((req, res, next) => {
  // All the helper functions

  const getFileType = (file) => {
    const mimeType = file.mimetype.split("/");
    return mimeType[mimeType.length - 1];
  };

  const generateFileName = (req, file, cb) => {
    const extension = getFileType(file);

    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + extension;
    cb(null, file.fieldname + "-" + filename);
  };

  const fileFilter = (req, file, cb) => {
    const extension = getFileType(file);

    const allowedType = /jpeg|jpg|png|svg/;

    const passed = allowedType.test(extension);

    if (passed) {
      return cb(null, true);
    }

    return cb(null, false);
  };

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(`Request body in image saver: `);
      console.log("BODY", req.body.user_id);
      const id = req.body.user_id;

      console.log(`User in image saver: `);
      console.log(req.body);
      const dest = `uploads/user/${id}`;

      fs.access(dest, (error) => {
        // if doesn't exist
        if (error) {
          return fs.mkdir(dest, (error) => {
            cb(error, dest);
          });
        } else {
          // it does exist
          fs.readdir(dest, (error, files) => {
            if (error) throw error;

            for (const file of files) {
              fs.unlink(path.join(dest, file), (error) => {
                if (error) throw error;
              });
            }
          });

          return cb(null, dest);
        }
      });
    },
    filename: generateFileName,
  });
  return multer({ storage, fileFilter }).single("avatar");
})();

export default userFile;
