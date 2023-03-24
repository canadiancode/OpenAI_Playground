// packages installed:
    // dotenv:    for keeping the API keys hidden
    // axios:     promise-based HTTPS requests using node.js
    // puppeteer: headless browser for extracting data from news
    // openai:    post prompt to OpenAI to summerize articles 

// Require dotenv to import API keys and run .config to load the API keys into the index.js file 
require('dotenv').config();

// Fetch the API key from the hidden folder
const OpenAPI_Key = process.env.OPEN_AI_API_KEY;
const X_RapidAPI_KEY = process.env.X_RapidAPI_KEY;

// FETCH RECENT CRYPTO NEWS ARTICLES -- FETCH RECENT CRYPTO NEWS ARTICLES -- FETCH RECENT CRYPTO NEWS ARTICLES

// require axios to be used for the HTTPS request
const axios = require("axios");

// for the API key
const options = {
  method: 'GET',
  url: 'https://crypto-news16.p.rapidapi.com/news/top/20',
  headers: {
    'X-RapidAPI-Key': X_RapidAPI_KEY,
    'X-RapidAPI-Host': 'crypto-news16.p.rapidapi.com'
  }
};

// retrieve the URL's for the top 20 trending news stories from coindesk
let article_Title_Array = [];
let article_URL_Array = [];

// retrieve the URL's from Rapid API
axios.request(options).then(function (response) {

    // remove old Titles and URL's from the previous day
    article_Title_Array = [];
    article_URL_Array = [];

    // loop through fetch data and push the URL's into an array
    response.data.forEach(data => {
        console.log(data);
        let url = data.url;
        article_URL_Array.push(url)
    });

    // console.log(article_URL_Array);

}).catch(function (error) {
	console.error(error);
    console.log('Could not fetch URL list...')
});

// SCRAPE ARTICLE CONTENT --  SCRAPE ARTICLE CONTENT -- SCRAPE ARTICLE CONTENT

// const puppeteer = require('puppeteer');

// async function scrapeArticle(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);

// };

// scrapeArticle('https://www.coindesk.com/business/2023/03/23/crypto-exchange-coinbase-shares-tumble-16-after-sec-enforcement-notice/?utm_medium=referral&utm_source=rss&utm_campaign=headlines');


// SUMMERIZE WITH OPENAI -- SUMMERIZE WITH OPENAI -- SUMMERIZE WITH OPENAI

// 2 imports from the OpenAI package
    // Configuration = object for defining things like API
    // OpenAIApi = provides an easy interface for interacting with the OpenAI API
const { Configuration, OpenAIApi } = require('openai');

// fetch the API key for the first argument in the post request 
const configuration = new Configuration({
    apiKey: OpenAPI_Key,
});

// Add the fethced API to the first argument of the post request
const openai = new OpenAIApi(configuration);

// Function to request OpenAI to run prompt
const runPrompt = async () => {

    const prompt = 'Tell me a joke about about a dog eating pasta';

    const response = await openai.createCompletion({
        model: 'gpt-4',
        prompt: prompt,
        max_tokens: 8192,
        temperature: 1
    });
    console.log(response.data.choices[0].text);
};
// runPrompt();