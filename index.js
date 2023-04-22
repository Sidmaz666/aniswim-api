const express = require('express'); 
const ani = require('./functions/main')
const cors = require('cors')
const corsAnywhere = require('cors-anywhere');


const server = express()

server.use(cors())

const port = process.env.PORT || 3020 

let proxy = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  // Do not require any headers.
  requireHeaders: ['origin','x-requested-with'],
  removeHeaders: [] // Do not remove any headers.
});

/* Attach our cors proxy to the existing API on the /proxy endpoint. */
server.get('/proxy/:proxyUrl*', (req, res) => {
  req.url = req.url.replace(/.*\/proxy\//g, '/'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
  proxy.emit('request', req, res);
});

server.get('/', (req,res) => {
  const page = req.query.page || 1
  ani.popular_anime(res,page)
})

server.get('/search', (req,res) => {
  const query = req.query.q
  const page = req.query.page || 1
  ani.search_anime(res,query,page)
})

server.get('/anime',(req,res) => {
  const id = req.query.id
  const ep = req.query.ep || 1
  ani.get_anime(res,id,ep)
})

server.get('/latest', (req,res) => {
  const page = req.query.page || 1
  ani.latest_anime(res, page)
})



server.use(function(req,res){
  	res.status(404).json({ message : "Error 404" })
})

server.listen(port, 
  () => {
    console.log(`http://localhost:${port}`)
  })

module.exports = server
