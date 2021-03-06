$(document).ready(function() {
    var userName = prompt('Enter your username')
    var hasAccount = false
    //Checks to see if there is an account under specified username. If none found, creates one
    $.ajax({
        type: 'GET',
        url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb',
        success: function(data) {
            data.forEach(function(account) {
                if (account.userName === userName) {
                    hasAccount = true
                }
                return
            })
            if (!hasAccount) {
                $.ajax({
                    type: 'POST',
                    url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        userName: userName,
                        tracks: {}
                    }),
                    success: function() {
                        alert('User created successfully');
                    }

                })
            }
        }
    })


    //Global variable definition
    var currentSelections = {}
    var upToDatePlaylist = {}
    var userTracks = {}
    var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'

    //Submit track familiarity search (view 1)
    $('#submit').click(function() {

        if ($('#song').val() === '' & $('#artist').val() === '') {
            console.log('nada selected');
            $('.no-input').html('No search criteria specified').slideDown(500)
            $('#guide').hide(500)
            return
        } else if  ($('#song').val() === '' || $('#artist').val() === ''){
            $('.no-input').html('Please specify both a track and an artist').slideDown(500)
            $('#guide').hide(500)
            return
        }

        var song = $('#song').val().trim()
        var artist = $('#artist').val().trim()

        $('.results').empty()
        $('.results').show(500)
        $('.my-playlist').hide(500)
        $('.error').empty()
        $('#guide').slideUp(500)
        $('.player').empty().slideUp(500)
        $('.player-header').empty().slideUp(500)
        $('.no-input').hide(500)

        //API call to LastFM (view 1)
        $.ajax({
            type: 'GET',
            url: `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${song}&api_key=${apiKey}&format=json`,
            success: function(data) {
                if (data.message === 'Track not found' || data.similartracks.track.length === 0) {
                    $('.error').html('Sorry, no track information found').slideDown(500)
                } else {
                    data.similartracks.track.forEach(function(track) {
                        $('.results').append(`<div class="result-tab left" id="${track.name}${track.artist.name}" data-track="${track.name}" data-artist="${track.artist.name}"><img src="${track.image[0]['#text']}"/><p>${track.name}, ${track.artist.name}</p></div>`)
                    })
                }

                //Track tab click to start playing song (view 1)
                $('.result-tab').click(function() {
                    $('.player').empty()
                    $('.player-header').empty()
                    $('.player').show(500)
                    $('.player-header').show(500)
                    $(this).toggleClass('clicked-tab', 500)
                    var trackName = $(this).attr('data-track')
                    var artistName = $(this).attr('data-artist')
                    $('.player-header').append(`<img src="green-heart.png" class="green-heart"/> <img src="Red_Heart.gif" class="red-heart"/><p> ${trackName}, ${artistName}</p>`)

                    //Save a track to your playlist
                    $('.green-heart').click(function() {
                        $(this).slideUp(500)
                        $('.red-heart').slideDown(500)

                        //Call to mongolab to update user playlist with new selections
                        $.ajax( {
                            url: "https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb",
                            type: "GET",
                            success: function(data) {
                                data.forEach(function(account) {
                                    if (account.userName === userName) {
                                        var mongoId = account._id.$oid;
                                        userTracks = account.tracks;
                                        for (song in currentSelections) {
                                            userTracks[song] = currentSelections[song]
                                        }
                                        $.ajax({
                                            type: 'PUT',
                                            url: `https://api.mlab.com/api/1/databases/songsearch/collections/playlist/${mongoId}?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb`,
                                            contentType: "application/json",
                                            data: JSON.stringify( { "$set" : { 'tracks' : userTracks } } )
                                        })
                                    }
                                })
                            }
                        });
                        currentSelections[trackName] = artistName
                    })

                    //API call to Spotify (view 1)
                    $.ajax({
                        type: 'GET',
                        url: `https://api.spotify.com/v1/search?q=${trackName} ${artistName}&type=track&market=US`,
                        success: function(data) {
                            var found = false
                            for (var i=0; i<data.tracks.items.length; i++) {
                                if (containsAll(data.tracks.items[i].name, trackName.toLowerCase()) && containsAll(data.tracks.items[i].artists[0].name, artistName.toLowerCase())) {
                                    $('.player').append(`<iframe src="${data.tracks.items[i].preview_url}" frameborder="0" allowfullscreen></iframe>`)
                                        found = true
                                        return
                                }
                            }
                            if (found === false) {
                                $('.player').append('<p>Sorry, no song preview available for this track</p>')
                            }
                        },
                        error: function() {
                            $('.player').append('<p>Sorry, no song preview available for this track</p>')
                        }
                    })
                    $('.clicked-tab').not(this).removeClass('clicked-tab', 500)
                });

                //Result hover functionality (view 1)
                $('.result-tab').hover(function() {
                    $(this).toggleClass('hover-tab')
                })


                //Submit button to view playlist - Changes to view 2 (view 1)
            },
            error: function() {
                alert('Error loading songs')
            }
        })
    })

    $('#view-playlist').click(function() {
        $('.songs').empty()
        $('.player-header').hide(500)
        $('.player').hide(500)
        $('.results').hide(500)
        $('#guide').hide(500)
        $('.error').hide(500)
        $('.my-playlist').show(500)

        // Call to mongolab to display up-to-date userplaylist (view 2)
        function displayUserPlaylist() {
            $('.songs').empty()
            $.ajax({
                type: 'GET',
                url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb',
                success: function(data) {
                    data.forEach(function(account) {
                        if (account.userName === userName) {
                            for (track in account.tracks) {
                                // $('.songs').append(`<li data-track="${track}">${track}, ${account.tracks[track]} </li>`)
                                $('.songs').append(`<div class="playlist-result" id="${track}${account.tracks[track]}" data-track="${track}" data-artist="${account.tracks[track]}"><p>${track}, ${account.tracks[track]}</p></div>`)
                                $('.songs p').last().append(`<img class="delete" src="delete-button.png">`)
                                // $('.playlist-result').sortable()
                            }
                        }
                    })

                    //Click delete to delete song from playlist
                    $('.delete').click(function() {
                        var trackToDelete = $(this).parent().parent().attr('data-track')
                        //Call to upload updated user playlist and delete track from local version
                        $.ajax({
                            url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb',
                            success: function(data) {
                                var userTracks = {}
                                var mongoId = ''
                                data.forEach(function(account) {
                                    if (account.userName === userName) {
                                        mongoId = account._id.$oid;
                                        userTracks = account.tracks
                                    }
                                })
                                delete userTracks[trackToDelete]

                                //Updates the database with the newest local version (track has been deleted)
                                $.ajax({
                                    type: 'PUT',
                                    url: `https://api.mlab.com/api/1/databases/songsearch/collections/playlist/${mongoId}?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb`,
                                    contentType: "application/json",
                                    data: JSON.stringify( { "$set" : { 'tracks' : userTracks } } ),
                                    success: alert('Track deleted from playlist successfully')
                                })

                                displayUserPlaylist()
                            }
                        })
                    })
                }
            })
        }

        displayUserPlaylist()

    })
})
