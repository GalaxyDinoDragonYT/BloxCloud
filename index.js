const https = require('https');
const fs = require('fs')
const FormData = require('form-data');

let standardDatastores = {}
let orderedDataStores = {}
let assets = {}
let placePublishing = {}
let messaging = {}

standardDatastores.getEntry = function (apiKey, datastoreName, datastoreEntryKey, universeId) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry?datastoreName=${datastoreName}&entryKey=${datastoreEntryKey}`;

  const options = {
    headers: {
      'x-api-key': apiKey
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body).value);
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
};

standardDatastores.setEntry = function (apiKey, datastoreName, datastoreEntryKey, universeId, scope, data) {
  const matchVersion = '';

  const postData = JSON.stringify({
    value: data,
    version: matchVersion,
    exclusive: false,
    scope
  });

  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry?datastoreName=${datastoreName}&entryKey=${datastoreEntryKey}`;

  const options = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
      'roblox-entry-attributes': JSON.stringify({}),
      'content-length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(url, options, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      const response = {
        status: res.statusCode,
        body: JSON.parse(body)
      };
      return Promise.resolve(response);
    });
  });

  req.on('error', (error) => {
    return Promise.reject(error);
  });

  req.write(postData);
  req.end();
};

standardDatastores.listStores = function (apiKey, universeId) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores`;

  const options = {
    headers: {
      'x-api-key': apiKey
    }
  };

  const req = https.request(url, options, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      return Promise.resolve(JSON.parse(body));
    });
  });

  req.on('error', (error) => {
    return Promise.reject(error);
  });

  req.end();
};

standardDatastores.listEntries = function (apiKey, universeId) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries`;
  const headers = {
    'x-api-key': apiKey
  };
  const qs = {
    datastoreName: datastoreName,
    prefix: ''
  };

  const req = https.request(`${url}?${new URLSearchParams(qs)}`, { headers }, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      return Promise.resolve(JSON.parse(body));
    });
  });

  req.on('error', (error) => {
    return Promise.reject(error);
  });

  req.end();
};

standardDatastores.deleteEntry = function (apiKey, universeId, datastoreName, entryKey) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry`;
  const headers = {
    'x-api-key': apiKey
  };
  const qs = {
    datastoreName: datastoreName,
    entryKey: entryKey
  };

  const options = {
    method: 'DELETE',
    headers: headers
  };

  return new Promise((resolve, reject) => {
    const req = https.request(`${url}?${new URLSearchParams(qs).toString()}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.end();
  });
}

standardDatastores.incrementEntry = function (apiKey, universeId, datastoreName, datastoreEntryKey, incrementBy) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/entry/increment`;
  const headers = {
    'x-api-key': apiKey,
    'content-length': '0',
  };
  const qs = {
    datastoreName,
    entryKey: datastoreEntryKey,
    incrementBy,
  };

  const options = {
    method: 'POST',
    headers: headers
  };

  return new Promise((resolve, reject) => {
    const req = https.request(`${url}?${new URLSearchParams(qs).toString()}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.end();
  });
}

standardDatastores.getEntryVersion = function (apiKey, universeId, datastoreName, entryKey, versionId) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/${entryKey}/versions/${versionId}`;
  const headers = {
    'x-api-key': apiKey
  };
  const qs = {
    datastoreName,
    entryKey,
    versionId
  };

  const options = {
    method: 'GET',
    headers: headers
  };

  return new Promise((resolve, reject) => {
    const req = https.request(`${url}?${new URLSearchParams(qs).toString()}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.end();
  });
}

standardDatastores.listEntryVersions = function (apiKey, universeId, datastoreName, entryKey, limit) {
  const url = `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries/${entryKey}/versions`;
  const headers = {
    'x-api-key': apiKey
  };
  const qs = {
    datastoreName,
    entryKey,
    limit
  };

  const options = {
    headers: headers,
    method: 'GET'
  };

  const fullUrl = `${url}?${new URLSearchParams(qs)}`;

  return new Promise((resolve, reject) => {
    const req = https.request(fullUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

//Ordered datastores

orderedDataStores.listEntries = function (apiKey, universeId, orderedDataStore, scope) {
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries`;
  const headers = {
    'x-api-key': apiKey
  };

  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

orderedDataStores.createEntry = function (apiKey, universeId, orderedDataStore, scope, id, value) {
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries?id=${id}`;
  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  };
  const data = {
    "value": value
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST', headers }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
};

orderedDataStores.getEntry = function (apiKey, universeId, orderedDataStore, scope, entry) {
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries/${entry}`;
  const headers = {
    'x-api-key': apiKey
  };

  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

orderedDataStores.deleteEntry = function (apiKey, universeId, orderedDataStore, scope, entry) {
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries/${entry}`;
  const headers = {
    'x-api-key': apiKey
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'DELETE', headers }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

orderedDataStores.updateEntry = function (apiKey, universeId, orderedDataStore, scope, entry, value) {
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries/${entry}`;
  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  };
  const data = {
    "value": value
  };

  return new Promise((resolve, reject) => {
    const req = https.patch(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

orderedDataStores.incrementEntry = function (apiKey, universeId, orderedDataStore, scope, entry, amount) {
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries/${entry}:increment`;
  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  };
  const data = {
    "amount": amount
  };

  return new Promise((resolve, reject) => {
    const req = https.post(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

//Assets

assets.createAsset = function (apiKey, userId, assetType, displayName, description, filePath) {
  const options = {
    hostname: 'apis.roblox.com',
    path: '/assets/v1/assets',
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'multipart/form-data'
    }
  };

  const form = new FormData();
  form.append('request', JSON.stringify({
    assetType: assetType,
    displayName: displayName,
    description: description,
    creationContext: {
      creator: {
        userId: userId
      }
    }
  }));
  form.append('fileContent', fs.createReadStream(filePath), { knownLength: fs.statSync(filePath).size, contentType: 'model/fbx' });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API call failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    form.pipe(req);

    req.on('error', (error) => {
      reject(error);
    });
  });
}

assets.updateAsset = function (apiKey, assetId, filePath) {
  const options = {
    hostname: 'apis.roblox.com',
    path: `/assets/v1/assets/${assetId}`,
    method: 'PATCH',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'multipart/form-data'
    }
  };

  const form = new FormData();
  form.append('request', JSON.stringify({
    assetId: assetId
  }));
  form.append('fileContent', fs.createReadStream(filePath), { knownLength: fs.statSync(filePath).size, contentType: 'model/fbx' });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API call failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    form.pipe(req);

    req.on('error', (error) => {
      reject(error);
    });
  });
};

assets.getOperationStatus = function (apiKey, operationId) {
  const options = {
    hostname: 'apis.roblox.com',
    path: `/assets/v1/operations/${operationId}`,
    method: 'GET',
    headers: {
      'x-api-key': apiKey
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API call failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

//Place publishing

placePublishing.publishXmlFile = function (apiKey, universeId, placeId, filePath) {
  const options = {
    hostname: 'apis.roblox.com',
    path: `/universes/v1/${universeId}/places/${placeId}/versions?versionType=Published`,
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/xml'
    }
  };

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API call failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    form.pipe(req);

    req.on('error', (error) => {
      reject(error);
    });
  });
};

placePublishing.publishBinaryFile = function (apiKey, universeId, placeId, filePath) {
  const options = {
    hostname: 'apis.roblox.com',
    path: `/universes/v1/${universeId}/places/${placeId}/versions?versionType=Published`,
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/octet-stream'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(req);
}

//Messaging

messaging.publishMessage = function (apiKey, universeId, topic, message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message: message });

    const options = {
      hostname: 'apis.roblox.com',
      path: `/messaging-service/v1/universes/${universeId}/topics/${topic}`,
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(responseBody);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

module.exports = { standardDatastores, orderedDataStores, assets, placePublishing, messaging }
