import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import global from '../global.mjs';

const uploadHandle = (err, req, res, next) => {
  console.log('uploadHandle uploadHandle');
  // app.use(function (err,req, res, next) {
  console.log('req.busboy', req);
  if (req.busboy) {
    req.pipe(req.busboy);

    req.busboy.on(
      'file',
      function (fieldname, file, filename, encoding, mimetype) {
        // ...
        // console.log('on file app', mimetype,filename);

        let fstream;
        let name = (global.getFormattedTime() + filename).replace(/\s/g, '');

        if (mimetype.includes('image')) {
          // name+=".jpg"
        }
        if (mimetype.includes('video')) {
          // name+="mp4";
        }
        let filePath = path.join(__dirname, '/public_media/customer/', name);
        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);
        fstream.on('close', function () {
          // console.log('Files saved');
          let url = 'customer/' + name;
          let obj = [{ name: name, url: url, type: mimetype }];
          req.photo_all = obj;
          next();
        });
      }
    );
  } else {
    next();
  }

  // });
};
export default uploadHandle;
