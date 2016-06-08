function containsAll(spotifyTitle,lastFMTitle) {
    var flag = true
    lastFMTitle.toLowerCase().split(' ').forEach(function(elem) {
        if (!spotifyTitle.toLowerCase().includes(elem)) {
            flag = false
        }
    })
    return flag
}

function displayUserPlaylist() {

    $('#view-playlist').click(function() {
        $('.songs').empty()
        $('.player-header').hide(500)
        $('.player').hide(500)
        $('.results').hide(500)
        $('#guide').hide(500)
        $('.error').hide(500)
        $('.my-playlist').show(500)

        // Call to mongolab to display up-to-date userplaylist (view 2)
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
                $('.songs div .delete').click(function() {
                    var trackToDelete = $(this).parent().attr('data-track')

                    //Call to get upload updated user playlist and delete track from local version
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

    })
}
