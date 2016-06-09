$(document).ready(function() {
    //Global variable definition
    var userTrack = ''
    var userArtist = ''
    var spotifyTrackName = ''
    var spotifyArtistName = ''
    var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'

    $('#submit').on('click', checkUserInput)
    $(document).on('mouseenter mouseleave', '.result-tab', highlightSelection)
    $(document).on('click', '.result-tab', showPlayerHeader)

    function checkUserInput(callback) {
        userTrack = $('#song').val().trim()
        userArtist = $('#artist').val().trim()
        $('.container').children().hide(500)
        if (userTrack === '' && userArtist === '') {
            $('.no-input').html('No search criteria specified').slideDown(500)
            return
        } else if (userTrack === '' || userArtist === ''){
            $('.no-input').html('Please specify both a track and an artist').slideDown(500)
            return
        }
        getSimilarTracks()
    }


    function getSimilarTracks() {
        $('.container').children().hide(500)
        $.ajax({
            url: `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${userArtist}&track=${userTrack}&api_key=${apiKey}&format=json`
        }).done(function(data) {
            appendSimilarTracks(data.similartracks.track)
        })

    }

    function appendSimilarTracks(similarTracks) {
        $('.results').empty()
        $('.results').show(500)
        similarTracks.forEach(function(elem) {
            var trackTitle = elem.name
            var artistName = elem.artist.name
            var resultTab = document.createElement('div')
            $(resultTab).addClass('result-tab')
            $(resultTab).attr('data-track', trackTitle)
            $(resultTab).attr('data-artist', artistName)
            var img = document.createElement('img')
            img.src = elem.image[0]['#text']
            $(img).appendTo(resultTab)
            var trackInfo = document.createElement('p')
            trackInfo.innerHTML = `${trackTitle}, ${artistName}`
            $(resultTab).append(trackInfo)
            $('.results').append(resultTab)
        })
    }

    function highlightSelection() {
        $(this).toggleClass('hover-tab')
    }


    function showPlayerHeader() {
        $('.player-header').show(500)
        $('.player').show(500)
        callToSpotify(this)
    }

    function callToSpotify(elem) {
        spotifyTrackName = $(elem).attr('data-track')
        spotifyArtistName = $(elem).attr('data-artist')
        $.ajax({
            url: `https://api.spotify.com/v1/search?q=${spotifyTrackName} ${spotifyArtistName}&type=track&market=US`
        }).done(function(data) {
            playSong(data.tracks.items)
        })
    }

    function playSong(tracks) {
        $('.player').empty()
        var found = false
        for (var i = 0; i < tracks.length; i++) {
            console.log(tracks[i].name)
            if (containsAll(tracks[i].name, spotifyTrackName.toLowerCase()) && containsAll(tracks[i].artists[0].name, spotifyArtistName.toLowerCase())) {
                $('.player').append(`<iframe src="${tracks[i].preview_url}" frameborder="0" allowfullscreen></iframe>`)
                    found = true
                    return
            }
        }
        if (found === false) {
            $('.player').append('<p>Sorry, no song preview available for this track</p>')
        }
    }







})
