'use strict';

const apiKey = '601c14869998103548596b0a4d73014d'
const secret = 'b9f3a060ae7f8dde02e6dca7708f9dea'

function displayResults(response) {
  
  console.log(`displayResults working`);
}

function getBio(response, num) {
  const mbid = response.topartists.artist[num].mbid;
  console.log(mbid);
  const bioURL = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${mbid}&api_key=${apiKey}&format=json`;
  console.log(bioURL);
  fetch(bioURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      console.log(responseJson);
      displayResults(responseJson);
    })
    .catch(err => {
      $(`#js-error`).text(`Something went wrong: ${err.message}`);
    })
}

function pickRandom() {
  return Math.floor(Math.random(0, 20) * Math.floor(20));
}

function callLastFm(URL) {
  fetch(URL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      console.log(responseJson);
      let artistNo = pickRandom();
      getBio(responseJson, artistNo);
    })
    .catch(err => {
      $(`#js-error`).text(`Something went wrong: ${err.message}`);
    })
  console.log(`callLastFm working`);
}


function createUrl(params) {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&limit=20&tag=${params.tag}&page=${params.page}&api_key=${params.key}&format=json`
  console.log(URL);
  callLastFm(URL);
  console.log('createUrl working');
}

function createParams(genre, apiKey) {
let pageNo = Math.floor(Math.random(0, 10) * Math.floor(10)) + 1;
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

// 2. After that we need to choose a random band from the list and push it to the DOM

// 3. Call the youtube API with a search for videos from the artist

$(handleForm());