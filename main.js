'use strict';

const apiKey = '601c14869998103548596b0a4d73014d'
const youtubeKey = 'AIzaSyBTltE9s9vSXGRZNhAg7d2KOEKvHVNje9E'

function displayYoutube(response) {
  $('#videos').empty().removeClass('hidden').append('<h3>Watch on Youtube!</h3>');
  // This if/else is used in case the Youtube results return nothing
  if (response.items.length === 0) {
    $('#videos').append('<p>No Youtube videos found. This one must be REALLY obscure!</p>');
  } else {
    for (let i = 0; i < response.items.length; i++) {
      $('#videos').append(`
        <a href="https://www.youtube.com/watch?v=${response.items[i].id.videoId}">
        <img src="${response.items[i].snippet.thumbnails.default.url}" alt="${response.items[i].snippet.title}" />
        <p>${response.items[i].snippet.title}</p>
        </a>
      `);
    }
  }
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
      $('#js-error').empty().text(`Something went wrong: ${err.message}`).removeClass('hidden');
    });
}

function handleYoutubeUrl(response) {
  // This function takes the info provided by the second last.fm call and builds a URL to call youtube
  const youtubeName = response.artist.name;
  const fixedYoutube = `${encodeURIComponent(youtubeName)}`;
  const artistGenre = response.artist.tags.tag[0].name;
  const fixedGenre = `${encodeURIComponent(artistGenre)}`;
  // This if/else statement checks to see how many listeners the artist has. I found that if the artist was pretty obscure you would get
  // weird results in the videos bar. If they have less than 50,000 listeners it adds the genre name to the youtube search
  const listeners = Number(response.artist.stats.listeners)
  if (listeners < 50000) {
    return `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${youtubeKey}&q="${fixedYoutube}"`;
  } else {
    return `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${youtubeKey}&q="${fixedYoutube}"%20${fixedGenre}`;
  }
}

function displayResults(response) {
  $('#instructions').addClass('hidden');
  $('#js-error').addClass('hidden');
  $('#artistinfo').empty().removeClass('hidden');
  // This if/else checks if the artist has a picture and makes adjustments accordingly
  if (response.artist.image[3]['#text'] === "") {
    $('#artistinfo').append(`
      <h2>${response.artist.name}</h2>
      <p>Artist image not found</p>
      <p>${response.artist.bio.summary}</p>
      <h3>Similar Artists</h3>
    `);
  } else {
    $('#artistinfo').append(`
      <h2>${response.artist.name}</h2>
      <img src="${response.artist.image[3][`#text`]}" alt="${response.artist.name}" />
      <p>${response.artist.bio.summary}</p>
      <h3>Similar Artists</h3>
    `);
  }
  // like the if/else above this one does the same for similar artists
  if (response.artist.similar.artist.length === 0) {
    $('#artistinfo').append('<p>No similar artists found</p>');
  } else{
    for (let i = 0; i < response.artist.similar.artist.length; i++) {
      $('#artistinfo').append(`<a href="${response.artist.similar.artist[i].url}">${response.artist.similar.artist[i].name}</a><br />`);
    }
  }
  const youtubeUrl = handleYoutubeUrl(response);
  callYoutube(youtubeUrl);
}

function getBio(response) {
  // Since the information provided in the first call is pretty minimal we have to make a second call after picking a random number
  // in order to get the random artist's bio, picture and similar artists. According to last.fm's API doc they are okay with multiple calls
  // as long as it's not "several calls per second"
  let num = Math.floor(Math.random(0, response.topartists.artist.length) * Math.floor(response.topartists.artist.length));
  const name = response.topartists.artist[num].name;
  const fixedName = `${encodeURIComponent(name)}`;
  const bioURL = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${fixedName}&api_key=${apiKey}&format=json`;
  fetch(bioURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      displayResults(responseJson);
    })
    .catch(err => {
      $('#js-error').empty().text(`Something went wrong: ${err.message}`).removeClass('hidden');
    });
}

function callLastFm(URL) {
  // This calls last.fm to get a list of the 100 top artists from the genre input
  fetch(URL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(responseJson => {
      getBio(responseJson);
    })
    .catch(err => {
      $('#js-error').empty().text('Genre not found. Try again!').removeClass('hidden');
    });
}

// These three functions take the input value and build a URL to call last.fm

function createUrl(params) {
  const URL = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&limit=100&tag=${params.tag}&page=1&api_key=${params.key}&format=json`;
  callLastFm(URL);
}

function createParams(genre, apiKey) {
  const params = {
    key: apiKey,
    tag: genre,
  }
  createUrl(params);
}

function handleForm() {
  $('#js-submit').click(event => {
    event.preventDefault();
    const genre = $('#genre').val();
    const tag = `${encodeURIComponent(genre)}`;
    createParams(tag, apiKey);
  })
}

$(handleForm());