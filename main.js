'use strict';

const apiKey = '601c14869998103548596b0a4d73014d'
const secret = 'b9f3a060ae7f8dde02e6dca7708f9dea'

// 1. We need to call to the last.fm API and pull the top artists from tag that the user submits

  // First we handle the form to keep it from submitting nothing and we pull the value from the search

function createUrl(params) {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${params.tag}&page=${params.page}&key=${params.key}&format=json`
  console.log(URL);
  console.log('createUrl working');
}

function createParams(genre, apiKey) {
let pageNo = Math.floor(Math.random(1, 4) * Math.floor(4)) + 1;
const params = {
  key: apiKey,
  tag: genre,
  page: pageNo
}
console.log(params);
createUrl(params);
console.log(`createParams working`);
}

function handleForm() {
  $(`#js-submit`).click(event => {
    event.preventDefault();
    const genre = $(`#genre`).val();
    createParams(genre, apiKey);
  })
  console.log('handleForm working');
}
  // Then we take the search value and push it into a URL that calls the api

  // Then we call the API to get a JSON response

// 2. After that we need to choose a random band from the list and push it to the DOM

// 3. Call the youtube API with a search for videos from the artist

$(handleForm());