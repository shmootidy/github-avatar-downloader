var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

function getRepoContributors (repoOwner, repoName, cb) {
  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN,
    }
  };
  request(options, function(err, res, body){
    cb(err, body);
  });
}

console.log('Welcome to the GitHub Avatar Downloader!');

// getRepoContributors('jquery', 'jquery', function(err, result){
//   // console.log('Errors:', err);
//   result = JSON.parse(result);
//   for (var user in result){
//     // console.log('Result:', result[user].avatar_url);
//   }
// });

function downloadImageByURL (url, filePath) {
  request.get(url)
          .on('error', (err) => {
            console.log("Something went wrong. Error," + err);
          })
          .on('response', (response) => {
            console.log("We got a response!");
          })
          .on('end', ()=>{
            console.log("Downloading images...");
          })
          .pipe(fs.createWriteStream(filePath))
          .on('finish', ()=>{
            console.log("Download complete. Check your directory for the file.")
          })
}

downloadImageByURL('https://avatars2.githubusercontent.com/u/2741?v=3&s=466', 'avatars/kvirani.jpg');