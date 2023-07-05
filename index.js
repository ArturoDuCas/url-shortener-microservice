require('dotenv').config();
const dns = require("dns");
const url = require('url');

const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Connect to the database
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    unique: true,
  },
});

urlSchema.plugin(AutoIncrement, {
  inc_field: "short_url",
});

let Url = mongoose.model("Url", urlSchema);

const findUrlByOriginalUrl = (originalUrl, done) => {
  Url.find({original_url: originalUrl}, (err, data) => {
    if(err) return console.log(err);
    done(null, data);
  })
};

const findUrlByShortUrl = (shortUrl, done) => {
  Url.findOne({short_url : shortUrl}, (err, data) => {
    if(err) return console.log(err);
    done(null, data);
  })
};

const createUrl = (originalUrl, done) => {
  let urlObject = new Url({original_url: originalUrl})
  urlObject.save((err, data) => {
    if(err) return console.log(err);
    done(null, data);
  });
}


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  let shortUrl = req.params.shorturl;
  findUrlByShortUrl(shortUrl, (err, data) => {
    if (err) {
      res.json({
        error: "internal error finding the url in the database",
      })
    } else {
      if (data) {
        res.redirect(data.original_url);
      } else {
        res.json({
          error : "No short URL found for the given input"
        })
      }
    }
  })

})


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}))
app.post('/api/shorturl', function(req, res) {
  const inputUrl = req.body.url;

  const parsedUrl = url.parse(inputUrl);
  const hostname = parsedUrl.hostname;

  dns.lookup(hostname, (err, address) => {
    if (err || !address) { // user inputs an invalid url
      res.json({
        error: "invalid url",
      });
    } else { // user input is a valid url
      findUrlByOriginalUrl(inputUrl, (err, data) => {
        if (err) {
          res.json({
            error: "internal error when searching for existing url on the database",
          });
        } else {
          if (data.length === 0) { // don't exist in the database yet
            createUrl(inputUrl, (err, data) => {
              if (err) {
                res.json({
                  error: "internal error when creating the document in the database"
                })
              } else {
                res.json({
                  original_url: data.original_url,
                  short_url: data.short_url,
                })
              }
            })
          } else { // Already exists on the database
            res.json({
              original_url: data[0].original_url,
              short_url: data[0].short_url,
            })
          }
        }
      });
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
