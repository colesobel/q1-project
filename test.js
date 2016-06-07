var spotify = "darrel hall and john oates"

var lastfm = "hall and oates yo"//.split(' ')
// console.log(matchString);


// console.log(testString.toLowerCase().includes(matchString.toLowerCase()))


function containsAll(lastFMTitle, spotifyTitle) {
    var flag = true
    lastFMTitle.toLowerCase().split(' ').forEach(function(elem) {
        if (!spotifyTitle.toLowerCase().includes(elem)) {
            flag = false
        }
    })
    return flag
}

console.log(containsAll(lastfm, spotify));
