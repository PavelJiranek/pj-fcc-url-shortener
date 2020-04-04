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

const createUrl = url => (
    new Url({
      short_url: 1, // todo unique, increment
      original_url: url,
    }));

const defaultDoneCallback = done => (err, data) => {
  if (err) return done(err);
  done(null, data);
};

const saveUrl = function (url, done) {
  url.save(defaultDoneCallback(done));
};

const findUrlById = async (urlId, done) => {
  Url.findById(urlId, ' original_url short_url -_id', defaultDoneCallback(done));
};

const removeAllUrls = done => {
  Url.deleteMany({}, defaultDoneCallback(done))
};

exports.removeAllUrls = removeAllUrls;
exports.createUrl = createUrl;
exports.saveUrl = saveUrl;
exports.findUrlById = findUrlById;
