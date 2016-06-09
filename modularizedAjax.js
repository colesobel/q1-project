$(document).ready(function () {

  var inputs = $('input')
  var userInput = inputs[0];
  var button = inputs[1];

  $(document).on('click', '.click_me', getMusic)
  $(document).on('click', '.get_artist', getArtist)

  $(button).on('click', makeRequest);

  function makeRequest(userInput) {
    $.ajax({
      url: 'http://www.omdbapi.com/?s=minions'
    }).done(function (results) {
      showImages(results.Search)
    })
  }

  function showImages(results) {
    results.forEach(function (result) {
      var posterUrl = result.Poster;
      var img = document.createElement('img');
      img.src = posterUrl
      $(img).addClass('click_me');
      var div = $('.results');
      $(img).appendTo(div);
    })
  }

  function getMusic() {
    $.ajax({
      url: 'https://api.spotify.com/v1/search?q=Steve%20Winwood&type=track&market=US'
    }).done(function (results) {
      showTracks(results.tracks.items)
    })
  }

  function showTracks(tracks) {
    $('.results').empty();
    tracks.forEach(function (track) {
      var artistId = track.artists[0].id;
      var div = document.createElement('div');
      var h2 = document.createElement('h2');
      $(h2).attr('id', artistId);
      $(h2).attr('data-artist', track.artists[0].name)
      h2.innerHTML = track.name;
      $(h2).addClass('get_artist');
      $(h2).appendTo(div)
      var audio = new Audio()
      audio.src = track.preview_url;
      audio.controls = 'controls';
      $(audio).appendTo(div);
      $(div).appendTo('.results')
    })
  }

  function getArtist() {
    var id = this.id
    var artistName = $(this).attr('data-artist');
    $.ajax({
      url: `https://api.spotify.com/v1/artists/${id}/albums`
    }).done(function (albums) {
      showArtistAlbums(albums.items, artistName)
    })
  }

  function showArtistAlbums(albums, artistName) {
    $('.results').empty();
    var h2 = document.createElement('h2');
    h2.innerHTML = artistName;
    $(h2).appendTo('.results');
    albums.forEach(function (album) {
      var div = document.createElement('div');
      var imageUrl = album.images[1].url;
      var h3 = document.createElement('h3')
      h3.innerHTML = album.name;
      var img = document.createElement('img');
      img.src = imageUrl;
      $(h3).appendTo(div)
      $(img).appendTo(div)
      $(div).appendTo('.results')

    })
  }

});
