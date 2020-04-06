const R = require('ramda');
const validUrl = require('valid-url');
const urlModule = require('url');


const getUrlId = R.prop('_id');

const validateUrl = url => validUrl.isWebUri(url);

const isInvalidUrl = url => R.isNil(validateUrl(url));

const getHostname = url => urlModule.parse(url).hostname;

/**
 * @param urlData - data from mongoose.find()
 * @returns {string}
 */
const getOrigUrl = urlData => R.path([0, 'original_url'], urlData);

module.exports = {
    getUrlId,
    isInvalidUrl,
    getHostname,
    getOrigUrl,
};
