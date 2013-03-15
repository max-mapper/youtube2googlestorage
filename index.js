var GAPI = require('node-gcs').gapitoken
var GCS = require('node-gcs')
var fs = require('fs')
var os = require('os')
var ytdl = require('ytdl')
var opts = {}

// streams through tmpdir() because of mysterious ECONNRESETs from GCS
// when streaming http -> http directly
// TODO refactor callback hell
module.exports = function(options, cb) {
  opts = options || opts
  googleAuth(function(err, storage) {
    cb(err, function(youtubeURL, youtubeCB) {
      youtubeStream(youtubeURL, function(err, tube) {
        if (err) return youtubeCB(err)
        var filename = os.tmpdir() + tube.info.video_id + '.webm'
        var out = fs.createWriteStream(filename)
        tube.stream.pipe(out)
        out.on('close', function() {
          uploadVideo(storage, fs.createReadStream(filename), '/' + tube.info.video_id, function(err, res) {
            fs.unlink(filename, function (unlinkErr) {
              if (unlinkErr) console.error(unlinkErr)
              youtubeCB(err, tube.info, res)
            })
          })
        })
      })
    })
  })
}

function googleAuth(cb) {
  var gAPIOptions = {
    iss: opts.email,
    scope: 'https://www.googleapis.com/auth/devstorage.read_write',
    keyFile: opts.pem
  }
  
  var gapi = new GAPI(gAPIOptions, function(err) {
    if (err) return cb(err)
    var gcs = new GCS(gapi)
    return cb(false, gcs)
  })
}

function uploadVideo(gcs, stream, filename, cb) {
  var headers = {
    'Content-Type': 'video/webm',
    'x-goog-acl': 'public-read'
  }
  gcs.putStream(stream, opts.bucket, filename, headers, cb)
}

function youtubeStream(youtubeURL, cb) {
  ytdl.getInfo(youtubeURL, function(err, info) {
    if (err) return cb(err)
    var hasWebM = false
    // http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
    info.fmt_list.map(function(format) {
      if (['43', '44', '45', '46'].indexOf(format[0]) > -1) hasWebM = true
    })
    if (!hasWebM) return cb(new Error('No WebM version available'))
    var dlOpts = {
      filter: function(format) {
        return format.container === 'webm'
      }
    }
    var stream = ytdl(youtubeURL, dlOpts)
    cb(false, {stream: stream, info: info})
  })
}
