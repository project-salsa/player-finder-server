const Request = require('./init').Request

function getRequest (requestID) {
    return new Promise((resolve, reject) => {
        Request.findOne({ _id: requestID }, (err, entry) => {
        if (err) {
            return reject(err)
        }
        else if (typeof(requestID) === undefined) {
        return reject(new Error('ERROR: Attempted to pass an undefined object into getRequest() function'))
    }
    return resolve(entry)
})
})
}

module.exports = {
    getRequest: getRequest
}