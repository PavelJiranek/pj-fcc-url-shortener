const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const r = require("ramda");

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  // short_url: { type: Number, required: true },
  short_url: { type: Number, default: 0, required: true, 
              // unique: true 
             },
  original_url: { type: String, required: true }
});

const Url = mongoose.model("Url", urlSchema);

const createUrl = url =>
  new Url({
    // short_url: 1, // todo unique, increment
    short_url: 1,
    original_url: url
  });

const defaultDoneCallback = (err, data) => {
    if (err) return err;
    return data;
  };

const saveUrl = function(url, done = defaultDoneCallback) {
  url.save((error, data) => {
    // console.log(error, data);

    if (error) return done(error);
    done(null, data);
  });
};


// const findUrlById = (urlId) => {
//   return  Url.findById(urlId, 'short_url original_url');
// };

const findUrlById = async (urlId, done = defaultDoneCallback) => {
 return Url.findById(urlId, (err, data) => {
    // console.log("found", urlId, err, data);
    if (err) return done(err);
    done(null, data);
  });
};

// const createAndSaveUrl = function({ url }, done) {
//   const newUrl = new Url({
//     short_url: 1,
//     original_url: url
//   });
//   newUrl.save((error, data) => {
//     // console.log(error, data);

//     if (error) return done(error);
//     done(null, data);
//   });
// };

// exports.createAndSaveUrl = createAndSaveUrl;
exports.createUrl = createUrl;
exports.saveUrl = saveUrl;
exports.findUrlById = findUrlById;

// const person = new Person({
//   name: "Melis",
//   age: 8,
//   favoriteFoods: ["Pizza", "Sushi"]
// });

// const createAndSavePerson = function(done) {
//   person.save((error, data) => {
//     console.log(error, data);

//     if (error) return done(error);
//     done(null, data);
//   });
// };
