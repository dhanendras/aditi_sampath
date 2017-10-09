// The exported functions in this module makes a call to Linguistics API that returns sentiment by a score (0 to 1).
// For more info, check out the API reference:
// https://https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze

const request = require('request');

const LINGUISTICS_API_URL = 'https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze',
      LINGUISTICS_KEY = '6e7ddb0d6fec4fe4b36de6da156e884e';

/**
 * Gets the correct spelling for the given text
 * @param {string} text The text to be analysed
 * @returns {Promise} 
 */
 
 
exports.ling = text => {
    return new Promise(
        (resolve, reject) => {
            if (text) {
                const requestData = {
                    url: LINGUISTICS_API_URL,
                    headers: {
                        "Ocp-Apim-Subscription-Key": LINGUISTICS_KEY
                    },
                    json: true,
                    body: {
                        "language" : "en",
                        //"analyzerIds" : ["4fa79af1-f22c-408d-98bb-b7d7aeef7f04", "22a6b758-420f-4745-8a3c-46835a67c0d2"],
                        "text" : text
                    }
                }

                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode != 200) {
                        reject(body);
                    }
                    else {
                        var result = '';

                        for (var i = 0; i < body.result.length; i++) {
                            result += body.result[i];
                        }

                        resolve(result);
                    }
                });
            } else {
                resolve(text);
            }
        }
    )
}
