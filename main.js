'use strict';

const apiKey = '601c14869998103548596b0a4d73014d'
const youtubeKey = 'AIzaSyBTltE9s9vSXGRZNhAg7d2KOEKvHVNje9E'
const secret = 'b9f3a060ae7f8dde02e6dca7708f9dea'

function displayYoutube(response) {
  console.log(response);
  console.log(`displayYoutube working`);
}

function callYoutube(name) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${youtubeKey}&q=${name}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      displayYoutube(responseJson);
    })
    .catch(err => {
      $(`#js-error`).text(`Something went wrong: ${err.message}`);
    })
  console.log(`callYoutube working`);  
}

function displayResults(response) {
  $(`#js-error`).empty();
  $(`#artistinfo`).empty();
  // I need an error for when there is no image of the artist //
  $(`#artistinfo`).append(
    `<h2>${response.artist.name}</h2>
    <img src="${response.artist.image[3][`#text`]}" alt="${response.artist.name}" />
    <p>${response.artist.bio.summary}</p>
    <h3>Similar Artists</h3>
    <ul>
      <li><a href="${response.artist.similar.artist[0].url}">${response.artist.similar.artist[0].name}</a></li>
      <li><a href="${response.artist.similar.artist[1].url}">${response.artist.similar.artist[1].name}</a></li>
      <li><a href="${response.artist.similar.artist[2].url}">${response.artist.similar.artist[2].name}</a></li>
    </ul>`
  );
  const youtubeName = response.artist.name;
  const fixedYoutube = `${encodeURIComponent(youtubeName)}`;
  callYoutube(fixedYoutube);
  console.log(`displayResults working`);
}

function getBio(response, num) {
  const name = response.topartists.artist[num].name;
  const fixedName = `${encodeURIComponent(name)}`;
  const bioURL = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${fixedName}&api_key=${apiKey}&format=json`;
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
  return Math.floor(Math.random(0, 10) * Math.floor(10));
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
      $(`#js-error`).text(`Genre not found`);
    })
  console.log(`callLastFm working`);
}


function createUrl(params) {
  const URL = `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&limit=10&tag=${params.tag}&page=${params.page}&api_key=${params.key}&format=json`
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
    const tag = `${encodeURIComponent(genre)}`;
    createParams(tag, apiKey);
  })
  console.log('handleForm working');
}

// 3. Call the youtube API with a search for videos from the artist

$(handleForm());