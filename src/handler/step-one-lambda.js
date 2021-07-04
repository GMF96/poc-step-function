const https = require('https');

exports.handler = async (event) => {
  console.log("Starting step 1")
  let cep = event.cep;
  let url = `https://viacep.com.br/ws/${cep}/json/`
  let data = '';
  
  const response = await new Promise((resolve, reject) => {
    const req = https.get(url, function(res) {
      res.on('data', d => {
        data += d;
      });
      res.on('end', () => {
        resolve({
          statusCode: 200,
          body: JSON.stringify(JSON.parse(data))
        });
      });
    });
    
    req.on('error', (e) => {
      reject({
          statusCode: 500,
          body: 'Something went wrong!'
      });
    });
  });
  return response;
};