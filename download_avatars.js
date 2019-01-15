var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');
var input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors (repoOwner, repoName, cb) {
  if (!repoOwner || !repoName){
    return console.log('You have to provide a repo owner and a repo name for this function to work.');
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

function makeDir(dirName){
  fs.mkdir(dirName, (err)=>{
    if (err) throw err;
  })
}

function downloadImageByURL (url, filePath) {
  request.get(url)
    .on('error', (err) => {
      console.log('Something went wrong. Error,' + err);
    })
    .on('response', (response) => {
      console.log('We got a response from ' + filePath + '!');
    })
    .on('end', ()=>{
      console.log('Downloading ' + filePath + '\'s image...');
    })
    .pipe(fs.createWriteStream('avatars/' + filePath + '.jpg'))
    .on('finish', ()=>{
      console.log('Download complete. Check your directory for ' + filePath + '\'s photo.')
  });
}

getRepoContributors(input[0], input[1], function(err, result){
  result = JSON.parse(result);
  makeDir('avatars/');
  for (var user in result){
    downloadImageByURL(result[user].avatar_url, result[user].login);
  }
});

