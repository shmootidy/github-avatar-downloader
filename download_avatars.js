require('dotenv').config();
var request = require('request');
var fs = require('fs');
var input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

// sends info to the cb to be processed. Info is from user and from the locally scoped options.
function getRepoContributors (repoOwner, repoName, cb) {
  if (!repoOwner || !repoName){
    return console.log('You have to provide a repo owner and a repo name for this function to work.');
  }
  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN,
    }
  };
  request(options, function(err, res, body){
    cb(err, body);
  });
}

// makes a new subdirectory to fill with photos
function makeDir(dirName){
  fs.mkdir(dirName, (err)=>{
    if (err) throw err;
  })
}

// makes the URL request, receives the response, and consoles a bunch of relevant messages; then downloads the images into the newly made dir
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

// checks the input for the correct length
function inputChecker (input) {
  var checker = true;
  if (input.length !== 2){
    console.log("Your input is incorrect. Two values, please.");
    checker = false;
    return checker;
  }
  return checker;
}


// calls the function with CLI input
getRepoContributors(input[0], input[1], function(err, result){
  if (inputChecker(input)){
    result = JSON.parse(result);
    makeDir('avatars/');
    for (var user in result){
      downloadImageByURL(result[user].avatar_url, result[user].login);
    }
  }
});

// STRETCH
// the folder to store images to does not exist - ✔
// an incorrect number of arguments given to program (0, 1, 3, etc.) - ✔
// the provided owner/repo does not exist
// the .env file is missing
// the .env file is missing information
// the .env file contains incorrect credentials