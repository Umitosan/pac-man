/*jshint esversion: 6 */
// const express = require('express');
// const app = express();
//
// app.get('/', (req, res) => res.send('Hello World!'));
//
// app.listen(3000, () => console.log('Example app listening on port 3000!'));



const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen( process.env.PORT || 8080, () => console.log('express server running') );
