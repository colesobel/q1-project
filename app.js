$(document).ready(function() {

    $('#submit').click(function() {

        $('.results-left').empty()
        $('.results-right').empty()
        $('.error').empty()
        $('#guide').slideUp(500)
        $('.player').empty()
        var song = $('#song').val().trim()
        var artist = $('#artist').val().trim()
        var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'

        //API call to LastFM
        $.ajax({
            type: 'GET',
            url: `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${song}&api_key=${apiKey}&format=json`,
            success: function(data) {
                if (data.message === 'Track not found' || data.similartracks.track.length === 0) {
                    $('.error').html('Sorry, no track information found').show(500)
                } else {
                    var flag = true
                    data.similartracks.track.forEach(function(track) {
                        if (flag === true) {
                            $('.results-left').append(`<div class="result-tab left" id="${track.name}${track.artist.name}" data-track="${track.name}" data-artist="${track.artist.name}"><img src="${track.image[0]['#text']}"/><p>${track.name}, ${track.artist.name}</p></div>`)
                            flag = !flag
                        } else {
                            $('.results-right').append(`<div class="result-tab right" id="${track.name}${track.artist.name}" data-track="${track.name}" data-artist="${track.artist.name}"><img src="${track.image[0]['#text']}"/><p>${track.name}, ${track.artist.name}</p></div>`)
                            flag = !flag
                        }
                    })
                }


                $('.result-tab').click(function() {
                    $('.player').empty()
                    $('.player-header').empty()
                    $('.player').show(500)
                    $('.player-header').show(500)
                    $(this).toggleClass('clicked-tab', 500)
                    var trackName = $(this).attr('data-track')
                    var artistName = $(this).attr('data-artist')
                    $('.player-header').append(`<p> ${trackName}, ${artistName}`)

                    //API call to Spotify
                    $.ajax({
                        type: 'GET',
                        url: `https://api.spotify.com/v1/search?q=${trackName}&type=track&market=US`,
                        success: function(data) {
                            var found = false
                            // console.log('api call track', trackName);
                            // console.log('api call artist', artistName);
                            for (var i=0; i<data.tracks.items.length; i++) {
                                // console.log(data.tracks.items[i].artists[0].name);
                                if (data.tracks.items[i].name.toLowerCase() === trackName.toLowerCase() && data.tracks.items[i].artists[0].name.toLowerCase() === artistName.toLowerCase())  {
                                    $('.player').append(`<iframe src="${data.tracks.items[i].preview_url}" frameborder="0" allowfullscreen></iframe>`)
                                    found = true
                                    return
                                }
                            }
                            if (found === false) {
                                $('.player').append('<p>Sorry, no song preview available for this track</p>')
                            }
                        }
                    })
                    $('.clicked-tab').not(this).removeClass('clicked-tab', 500)
                });


                $('.result-tab').hover(function() {
                    $(this).toggleClass('hover-tab')
                })


            },
            error: function() {
                alert('Error loading songs')
            }
        })

    })


})
