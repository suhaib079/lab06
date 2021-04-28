'use strict';
//setup//
const express = require('express');
const server = express();

 const pg =require('pg');
 const client =new pg.Client(process.env.DATABASE_URL);
 

require('dotenv').config();
const cors = require('cors');
const superagent =require('superagent');
const superAgent0 =require('superagent');

// databace//


const PORT =process.env.PORT || 3000;

server.use(cors());



client.connect().then(()=> {
  server.listen(PORT, () =>{
       console.log('hi '+ PORT);
  })

});





server.get('/data',(req,res)=>{
    res.send('what i see on web ');
})

//loction 
server.get('/location',loctionHandler);

function X(cityName ,locData){
    this.search_query = cityName;
    this.formatted_query= locData.display_name;
    this.latitude = locData.lat;
    this.longitude = locData.lon;
}





function loctionHandler(req,res){
  const  cityName = req.query.city;
   console.log(req.query);
   let SQL = 'SELECT search_query FROM locations;';
   let valuFROMsql =[];
   let cityss=[];


   client.query(SQL).then(dats => {
     valuFROMsql = dats.rows;
    cityss =valuFROMsql.map(element => {
      return element.search_query; 
    });
    
   if(!cityss.includes(cityName)){
    let key = process.env.LOCATION_KEY;
   
    let url =`https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`
  
    
    superagent.get(url).then(info =>{
      let locObj  = new X(cityName,info.body[0]);
      let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;';
      let saveVal=[locObj.search_query,locObj.formatted_query,locObj.latitude,locObj.longitude];

      client.query(SQL,saveVal).then(result=> {
        res.send(result.rows);
        
      });

      console.log('from API');
      response.send(locObj);
    });
  } else {
    let SQL = `SELECT * FROM locations WHERE search_query = '${cityName}';`;
    client.query(SQL)
      .then(result=>{
        console.log('from dataBase');
        response.send(result.rows[0]);
      });
  }
});
}

















//weather 

server.get('/weather',weatherHandler);


function Weather(datawith){
    this.forecast = datawith.weather.description ;
  this.time = datawith.datetime;
}

function weatherHandler(req,res){
  const  weatherKey = process.env.weatherKey;
  const cityName = req.query.city;
  let url =`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${weatherKey}`

console.log(req.query);
  superagent.get(url).then(weatherData =>{
    let weatherdata12=weatherData.body.data.map(element => {
      let withobj  = new Weather(element);
      return withobj;

    });

       res.send(weatherdata12)
})
  
};



server.get('/parks', handlePark );

  function Park (parkData) {
    this.name = parkData.name ;
    this.address = parkData.address;
    this.fee = parkData.fee;
    this.description = parkData.description;
    this.url = parkData.url;
  }

  function handlePark(request,response){
    let parkKey = process.env.parkKey;
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
  
    // const parkCode = request.query.parkCode;
  
    //https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=lUQX63yCYlb0s2d3kx5hAwScVfNNM4E4ZLNOYbYX
  
    // let url = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${parkKey}`;
    let url = `https://developer.nps.gov/api/v1/parks?latitude=${latitude}&longitude=${longitude}&api_key=${parkKey}`;
  
    superAgent0.get(url).then(parkData =>{
       console.log(parkData);
      let parkData0 = parkData.body.data.map(element => {
        const parkObject = new Park(element);
        return parkObject;
      });
      response.send(parkData0);
    })
  
  }



//wrong route//

server.use('*',(req,res)=>{
    res.status(404).send('Error message // The Route not found');
  });


  