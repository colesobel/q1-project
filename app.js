$(document).ready(function() {

    $('#submit').click(function() {

        $('.results').empty()
        $('.results').addClass('result-active')
        $('.results').accordion()
        var song = $('#song').val().trim()
        var artist = $('#artist').val().trim()
        var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'


        $.ajax({
            type: 'GET',
            url: `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${song}&api_key=${apiKey}&format=json`,
            success: function(data) {
                var flag = true
                if (data.message === 'Track not found' || data.similartracks.track.length === 0) {
                    $('.results').append('<h2 class="error">Sorry, no track information found</h2>')
                } else {
                    data.similartracks.track.forEach(function(track) {
                        if (flag === true) {
                            $('.results').append(`<div class="result-tab left"><img src="${track.image[0]['#text']}"/><p>${track.name}, ${track.artist.name}</p></div>`)
                            flag = !flag
                            console.log(flag);
                        } else {
                            $('.results').append(`<div class="result-tab right"><img src="${track.image[0]['#text']}"/><p>${track.name}, ${track.artist.name}</p></div>`)
                            flag = !flag
                            console.log(flag);
                        }
                    })
                }


                $('.result-tab').click(function() {
                    $(this).animate({
                        height: '200px'
                    })
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
