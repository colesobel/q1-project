$(document).ready(function() {

    $('#submit').click(function() {

        $('.results-left').empty()
        $('.results-right').empty()
        $('.error').empty()
        $('#guide').slideUp(500)
        var song = $('#song').val().trim()
        var artist = $('#artist').val().trim()
        var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'


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
                    $(this).toggleClass('clicked-tab', 500)
                    var trackName = $(this).attr('data-track')
                    var artistName = $(this).attr('data-artist')
                    $.ajax({
                        type: 'GET',
                        url: `https://api.spotify.com/v1/search?q=${trackName}&type=track&market=US`,
                        success: function(data) {
                            console.log('api call track', trackName);
                            console.log('api call artist', artistName);
                            for (var i=0; i<data.tracks.items.length; i++) {
                                if (data.tracks.items[i].name === trackName)  {
                                    $('.clicked-tab').append(`<iframe width="560" height="315" src="${data.tracks.items[i].preview_url}" frameborder="0" allowfullscreen></iframe>`)
                                    console.log('success');
                                    return
                                }
                            }
                        }
                    })

                    // $('.result-tab').append('<p class="content">hello</p>').find('.content').not(remove())
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
