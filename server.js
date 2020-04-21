const express = require('express');
const app = express();
const fetch = require('node-fetch');
const sslRedirect = require('heroku-ssl-redirect');

port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(sslRedirect());


app.get('/country', async (req, res) => {
    let data = null;
    const country = req.query.name;
    try{
        const response = await fetch("https://corona.lmao.ninja/v2/historical/" + country);
        data = await response.json();
    } catch(err){
        console.log(err)
    }
    res.json({data});
});

app.get('/', async (req, res) => {
    let IndiaStateWise = [];
    let IndiaCasesTimeSeries = [];
    let districtWise = [];    
    try{
        const response = await Promise.all([
            fetch("https://api.covid19india.org/data.json"),
            fetch("https://api.covid19india.org/state_district_wise.json")
        ]);

        let data = await response[0].json();
        districtWise = await response[1].json();
        IndiaStateWise = data.statewise;
        IndiaCasesTimeSeries = data.cases_time_series;        
    } catch(err){
        console.log(err)
    }
    res.render('pages/india', {IndiaStateWise, IndiaCasesTimeSeries, districtWise});
});

app.get('*', async (req, res) => {
    let worldStatsCountryWise = [];
    let worldStats = {};
    try{
        const response = await Promise.all([
            fetch("https://corona.lmao.ninja/v2/all"),
            fetch("https://corona.lmao.ninja/v2/countries?")
        ]);

        worldStats = await response[0].json();
        worldStatsCountryWise = await response[1].json();

    } catch(err){
        console.log(err)
    }
    res.render('pages/index', {worldStats, worldStatsCountryWise});
});


// https://corona.lmao.ninja/v2/historical/india

app.listen(port, () => console.log(`running on port : ${port}`));