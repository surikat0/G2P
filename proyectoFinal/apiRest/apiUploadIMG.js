const bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
var os = require("os");
var express = require("express");
var app = express();
var Busboy = require("busboy");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
app.get("/", function (req, res) {
  res.send(
    '<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
                <input type="text" name="textfield"><br />\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>'
  );
  res.end();
});

// accept POST request on the homepage
app.post("/upload", function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    var saveTo = path.join("../src/assets/images", filename);
    console.log("Uploading: " + saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on("finish", function () {
    console.log("Upload complete");
    // res.writeHead(200, { Connection: "close" });
    res.end("That's all folks!");
  });
  req.pipe(busboy);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
