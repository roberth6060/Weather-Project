/** 
 * To receive text that is typed in input you need to install body-parser (npm i body-parser).
 * body-parser allows user to look thruough the body of post request and fetch data, based on name of input.
 * 
*/
const {
    json
} = require("body-parser");
const {
    response
} = require("express");
const express = require("express");
//Native node.js modules:
const https = require("https");

const app = express();

const bodyParser = require("body-parser");
const { truncate } = require("fs/promises");
app.use(bodyParser.urlencoded({extended: true}));

//NOTE: We can only have one res.send in any given app method.
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//Helps with getting dynamic data based on what user typed which is catached with app.post
//form going to root route witha app.post:
app.post('/', function (req, res) {
    console.log(req.body.cityName); //Returns typed keyword: ex. London
    //query is used to structure data and get data for location. 
    const query = req.body.cityName;
    const apiKey = "91723564ecd2f116b12e728ace8a6885";
    const unit = "metric";

    //Making GET Requests with the node HTTPS Module
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            //convert data into JavaScript object:
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            //Use weatherData to pull out specific infomation (object: main, key: temp)
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            //Retrieve icon form (https://openweathermap.org/):
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            //You can only ahve one res.send, but you can have multiple res.write
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degree Celcius.</h1>");
            res.write("<img src =" + imageURL + ">");
            res.send()
        })
    })
});

app.listen(3000, function () {
    console.log("Sever is running on port 3000.");
});