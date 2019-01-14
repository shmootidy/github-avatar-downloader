var request = require('request');

function getRepoContributors (repoOwner, repoName, cb) {
  // body...
}

console.log('Welcome to the GitHub Avatar Downloader!');

getRepoContributors('jquery', 'jquery', function(err, result){
  console.log('Errors:', err);
  console.log('Result:', result);
})