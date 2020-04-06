const mongoose = require("mongoose"),
    autoIncrement = require('mongoose-auto-increment'),
    dns = require('dns');
const utils = require('./utils');

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

const invalidUrl = {"error": "invalid URL"};

const validateHost = (url, done) => {
    const hostname = utils.getHostname(url);
    dns.lookup(
        hostname,
        {all: true},  // returns the result in a single array
        defaultDoneCallback(done),
    );
};

const createUrl = url => new Url({original_url: url});

const saveUrl = function (url, done) {
    url.save(defaultDoneCallback(done));
};

const findUrlById = (urlId, done) => {
    Url.findById(urlId, 'original_url short_url -_id', defaultDoneCallback(done));
};

const findUrlByShortUrl = (shortUrl, done) => {
    Url.find({short_url: shortUrl}, 'original_url -_id', defaultDoneCallback(done));
};

/**
 * @param shortUrl - url object from Url model via createUrl()
 * @param res - response object
 * @param next - server's next() handler
 */
const saveAndSendUrl = function (shortUrl, res, next) {
    saveUrl(shortUrl, (err, urlData) => {
        if (err) {
            return next(`Error when saving url:\n${err}`);
        }
        findUrlById(utils.getUrlId(urlData), (err, savedUrlData) => {
            if (err) {
                return next(`Created url not found with error:\n${err}`);
            }
            res.json(savedUrlData)
        })
    })
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

module.exports = {
    invalidUrl,
    validateHost,
    createUrl,
    saveUrl,
    findUrlById,
    saveAndSendUrl,
    findUrlByShortUrl,
    removeAllUrls,
};
