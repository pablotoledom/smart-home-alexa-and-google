const https = require('https');

async function handleDiscovery(request) {
    // try to call smarthome api
    const devices = await callAPIsmarthome(request, request.directive.payload.scope.token);
    if (devices.statusCode === 200) {
        console.log('Show Discovery', devices);
    }

    return devices;
}

async function handleCommonEvent(request) {
    // try to call smarthome api
    const result = await callAPIsmarthome(request, request.directive.endpoint.scope.token);
    if (result.statusCode === 200) {
        console.log('Show result PowerControl', result);
    }
    
    return result;
}

async function callAPIsmarthome(alexaRequest, token) {
    console.log('DEBUG: ', 'Endpoint call', '');

    const options = {
        hostname: 'yourDomain',
        port: 443,
        path: '/api/smarthome/amazon',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        json: true
    };
    
    const postData = JSON.stringify(alexaRequest);
    
    const response = await new Promise((resolve, reject) => {
        // Set up the request
        const post_req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                const devices = JSON.parse(chunk);
                resolve({
                    ...devices,
                    statusCode: 200
                });
            });
            res.on('error', function (e) {
                console.log("Got error: " + e.message);
                reject({
                    statusCode: 500
                });
            });
        
        });

        post_req.write(postData);
        post_req.end();  
    });
    
    return response;
};

exports.handler = async function (request, context) {
    console.log("DEBUG: ", "Main equest",  JSON.stringify(request));
    
    if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        console.log("DEBUG: ", "Discover request",  JSON.stringify(request));
        return await handleDiscovery(request, context);
    }
    else if (request.directive.header.namespace && request.directive.header.name) {
        console.log("DEBUG: ", "CommonEvent request ",  JSON.stringify(request));
        return await handleCommonEvent(request);
    }
};
