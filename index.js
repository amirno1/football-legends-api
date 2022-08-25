const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const legends = [];
app.get("/", (req, res) => {
  res.json("Welcome to footbal legends API");
});

app.get("/legends", (req, res) => {
  axios
    .get("https://sportmob.com/en/article/920991-Top-Footballers-by-Country")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("h3")
        .filter(function () {
          return !$(this).text().includes("?");
        })
        .each(function () {
          const legendCountry = $(this).text().split(" (")[0];
          const legendsName = $(this)
            .text()
            .replace(")", "")
            .split(" (")[1]
            .split(",");
          legends.push({
            country: legendCountry,
            name: legendsName,
          });
        });
      res.json(legends);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on port ${PORT} `));
