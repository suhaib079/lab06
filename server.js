'use strict';
//setup//
const express = require('express');
const server = express();


require('dotenv').config();
const cors = require('cors');



const PORT =process.env.PORT || 3000;

server.use(cors());

server.listen(PORT, () =>{
    console.log('hi '+ PORT);
})





server.get('/data',(req,res)=>{
    res.send('what i see on web ');
})

//loction 

function X(data){
    this.search_query = 'Lynnwood';
    this.formatted_query= data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
}






server.get('/location',(req,res) =>{
    let locations = require('./data/location.json');
      let locObj  = new X(locations);
      res.send(locObj)

    console.log(locObj);
})


//weather 
function Weather(datawith){
    this.forecast = datawith.weather.description ;
  this.time = datawith.datetime;
}

server.get('/weather',(req,res) =>{
    let weatherjson=require('./data/weather.json')

const weatherData = [];
weatherjson.data.forEach(element => {
  const weatherObject = new Weather(element);
  weatherData.push(weatherObject);
});
res.send(weatherData);
console.log(weatherData);
});

//wrong route//

server.use('*',(req,res)=>{
    res.status(404).send('Error message // The Route not found');
  });
  