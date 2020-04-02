const express = require('express');
const app = express();
const fetch = require('node-fetch');

port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(express.static('public'))

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

app.get('*', async (req, res) => {
    let worldStatsCountryWise = [];
    let worldStats = null;
    try{
        const response = await Promise.all([
            fetch("https://corona.lmao.ninja/all"),
            fetch("https://corona.lmao.ninja/countries?")
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