const mongoose = require("mongoose"),
    autoIncrement = require('mongoose-auto-increment');

require('dotenv').config();

const connection = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

autoIncrement.initialize(connection);

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    short_url: {
        type: Number,
        required: true,
        unique: true,
    },
    original_url: {type: String, required: true},
});

urlSchema.plugin(autoIncrement.plugin, {model: 'Url', field: 'short_url'});
const Url = connection.model("Url", urlSchema);


const defaultDoneCallback = done => (err, data) => {
    if (err) return done(err);
    done(null, data);
};

const createUrl = url => new Url({original_url: url});

const saveUrl = function (url, done) {
    url.save(defaultDoneCallback(done));
};

const findUrlById = async (urlId, done) => {
    Url.findById(urlId, ' original_url short_url -_id', defaultDoneCallback(done));
};

const removeAllUrls = done => {
    Url.deleteMany({}, (err, data) => {
        if (err) return done(err);
        Url.resetCount((err, nextCount) => {
            if (err) return done(err);
            data.nextCount = nextCount;
            done(null, data);
        })
    })
};

exports.removeAllUrls = removeAllUrls;
exports.createUrl = createUrl;
exports.saveUrl = saveUrl;
exports.findUrlById = findUrlById;
