'use strict';

const apiKey = '601c14869998103548596b0a4d73014d'
const youtubeKey = 'AIzaSyBTltE9s9vSXGRZNhAg7d2KOEKvHVNje9E'
const secret = 'b9f3a060ae7f8dde02e6dca7708f9dea'

function displayYoutube(response) {
  console.log(response);
  $(`#videos`).empty();
  $(`#videos`).append(`<h3>Watch on Youtube!</h3>`)
  if (response.items.length === 0) {
    $(`#videos`).append(`<p>No Youtube videos found. This one must be REALLY obscure</p>`)
  } else {
    for (let i = 0; i < response.items.length; i++) {
      $(`#videos`).append(
        `<a href="https://www.youtube.com/watch?v=${response.items[i].id.videoId}">
        <img src="${response.items[i].snippet.thumbnails.default.url}" alt="${response.items[i].snippet.title}" />
        <p>${response.items[i].snippet.title}</p>
        </a>`
      )
    }
  }
  console.log(`displayYoutube working`);
}

function callYoutube(URL) {
  fetch(URL)
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

function handleYoutubeUrl(response) {
  const youtubeName = response.artist.name;
  const fixedYoutube = `${encodeURIComponent(youtubeName)}`;
  const artistGenre = response.artist.tags.tag[0].name;
  const fixedGenre = `${encodeURIComponent(artistGenre)}`
  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${youtubeKey}&q="${fixedYoutube}"%20${fixedGenre}`;
  console.log(youtubeUrl);
  return youtubeUrl;
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
    <ul id="similar">
  
    </ul>`
  );
  if (response.artist.similar.artist.length === 0) {
    $(`#similar`).append(`<li>No similar artists found</li>`);
  } else{
    for (let i = 0; i < response.artist.similar.artist.length; i++) {
      $(`#similar`).append(`<li><a href="${response.artist.similar.artist[i].url}">${response.artist.similar.artist[i].name}</a></li>`);
    }
  }
  const youtubeUrl = handleYoutubeUrl(response);
  callYoutube(youtubeUrl);
  console.log(`displayResults working`);
}

function getBio(response, num) {
  const name = response.topartists.artist[num].name;
  const fixedName = `${encodeURIComponent(name)}`;
  const bioURL = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${fixedName}&api_key=${apiKey}&format=json`;
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
  return Math.floor(Math.random(0, 100) * Math.floor(100));
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
  const URL = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&limit=100&tag=${params.tag}&page=${params.page}&api_key=${params.key}&format=json`
  console.log(URL);
  callLastFm(URL);
  console.log('createUrl working');
}

function createParams(genre, apiKey) {
let pageNo = 1
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

$(handleForm());