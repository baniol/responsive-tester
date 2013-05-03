connect = require 'connect'
http = require 'http'

app = connect()

app.use connect.static __dirname
app.use "./css", connect.static "./css"
app.use connect.static "#{__dirname}./js"

http.createServer app
http.listen 8080
console.log "listening..."


