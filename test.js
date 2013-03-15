var longDocumentary = 'http://www.youtube.com/watch?v=Sv36Sac_Ibw'
var shortCatVideo = 'http://www.youtube.com/watch?v=pCxITr8VeX4'
var bucket = process.env['ARCHIVE_BUCKET']
var gcsEmail = process.env['ARCHIVE_EMAIL']
var pemPath = process.env['ARCHIVE_PEM']
var y2gs = require('./')

var options = {
  'email': gcsEmail,
  'pem': pemPath,
  'bucket': bucket
}

console.log(options)

y2gs(options, function(err, upload) {
  upload(shortCatVideo, function(err, info, resp) {
    console.log(err, resp)
  })
})
