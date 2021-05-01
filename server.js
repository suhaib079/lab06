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


////////////////////////////////////loction////////////////////////////// 
server.get('/location',loctionHandler);

function X(cityName ,locData){
    this.search_query = cityName;
    this.formatted_query= locData.display_name;
    this.latitude = locData.lat;
    this.longitude = locData.lon;
}





function loctionHandler(req,res){
  const  cityName = req.query.city;
  let key = process.env.LOCATION_KEY;
  let url =`https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`
  
   let SQL = 'SELECT * FROM locations where search_query=$1;';
   let valuFROMsql =[];
   let cityss=[];


   client.query(SQL,[cityName]).then(dats => {
     if(data.rowCount>0){
       res.send(data.rows[0]);
     } else {
       superagent.get(url).then(getdata => {
         let getData= getdata.body;
         let locObj  = new X(cityName,getData);

        let search_query = cityName;
         let formatted_query= getData[0].display_name;
         let latitude = getData[0].lat;
         let longitude = getData[0].lon;

         let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;';
         let saveVal=[search_query,formatted_query,latitude,longitude];
         client.query(SQL,saveVal);
         res.send(locObj);
       })

       .catch(error => {
         res.send(error)
       });
     }
    });
  };
     




//////////////////////////////////////////////////////////weather//////////////////////////////////////////// 

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

////////////////////////////////////////////parks///////////////////////////////

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


  // movies// 
  
  server.get('/movies', moviehandler );

  function Movie (mdata){
  this.title =mdata.title;
  this.overview = mdata.overview;
  this.average_votes=mdata.average_votes;
  this.total_votes = mdata.vote_count;
  this.image_url =`https://image.tmdb.org/t/p/w500${mdata.poster_path}`;
  this.popularity = mdata.popularity;
  this.released_on = mdata.release_date;
  }

  function moviehandler(req,res){
  const cityName =req.query.search_query;
  let key3 = process.env.MOVIES_KEY;
  let url =`https://api.themoviedb.org/3/movie/550?api_key=${key3}&query=${cityName}`;
   superagent.get(url).then(moviedata => {
    let moviesObjArr = moviedata.body.results.map(value => {
      return new Movies(value)
   })
   res.send(moviesObjArr)
  })
  }



  ///////////////////////////////////////////////// yelp//////////////////////////////////////////

  server.get('/yelp', yelpHandler);



  function Yelp(yelpData) {
    this.name = yelpData.name;
    this.image_url = yelpData.image_url;
    this.price = yelpData.price;
    this.rating = yelpData.rating;
    this.url = yelpData.url;
};

function yelpHandler(req, res) {
  let cityName = req.query.search_query;
  let page = req.query.page;
  const limts = 5;
  const start = ((page - 1) * limts + 1)
  let key4 = process.env.YELP_KEY;
  let url = `https://api.yelp.com/v3/businesses/search?location=${cityName}&limit=${limitNum}&offset=${start}`

  let yelpRest = axios.create({
      baseURL: "https://api.yelp.com/v3/",
      headers: {
          Authorization: `Bearer ${key4}`,
          "Content-type": "application/json",
      },
  })
  yelpRest(url)
      .then(({ data }) => {
          let yelpobj = data.businesses.map(value => {
              return new Yelp(value)
          })
          res.send(yelpobj)
      })
}
