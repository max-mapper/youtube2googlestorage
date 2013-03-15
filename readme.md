# youtube2googlestorage

perhaps a niche interest module, this takes youtube urls and streams the webm version to a google storage account

## installation

```
npm install youtube2googlestorage
```

## usage

see https://github.com/bsphere/node-gapitoken for instructions on how to get the email and pem

```js
var y2gs = require('youtube2googlestorage')
var options = {
  'email': 'your google cloud storage "service account" email',
  'pem': 'path to your pem file',
  'bucket': 'the name of the google storage bucket to put videos into'
}

y2gs(options, function(err, upload) {
  upload('http://www.youtube.com/watch?v=pCxITr8VeX4', function(err, info, resp) {
    
  })
})

```

## license

BSD