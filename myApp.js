const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const R = require("ramda");

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  short_url: {
    type: Number,
    // default: 0,
    required: true,
    // unique: true
  },
  original_url: {type: String, required: true},
});

const Url = mongoose.model("Url", urlSchema);

const createUrl = url =>(
    new Url({
      short_url: 1, // todo unique, increment
      original_url: url,
    }));

const saveUrl = function (url, done) {
  url.save((error, data) => {
    if (error) return done(error);
    done(null, data);
  });
};


const findUrlById = async (urlId, done) => {
  Url.findById(urlId, ' original_url short_url -_id', (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};


exports.createUrl = createUrl;
exports.saveUrl = saveUrl;
exports.findUrlById = findUrlById;
