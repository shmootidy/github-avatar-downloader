var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');
var input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors (repoOwner, repoName, cb) {
  if (!repoOwner || !repoName){
    return console.log("You have to provide a repo owner and a repo name for this function to work.");
  }
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

getRepoContributors(input[0], input[1], function(err, result){
  result = JSON.parse(result);
  for (var user in result){
    downloadImageByURL(result[user].avatar_url, 'avatars/' + result[user].login + '.jpg');
  }
});

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