// packages installed (npm install _______):
    // dotenv:    for keeping the API keys hidden
    // axios:     promise-based HTTPS requests using node.js
    // puppeteer: headless browser controlled by code
    // openai:    post prompt to OpenAI to summerize articles 

// Require dotenv to import API keys and run .config to load the API keys into the index.js file 
require('dotenv').config();

// Fetch the API key from the hidden folder
const OpenAPI_Key = process.env.OPEN_AI_API_KEY;
const X_RapidAPI_KEY = process.env.X_RapidAPI_KEY;

// FETCH RECENT CRYPTO NEWS ARTICLES -- FETCH RECENT CRYPTO NEWS ARTICLES -- FETCH RECENT CRYPTO NEWS ARTICLES

// require axios to be used for the HTTPS request and puppeteer for scraping data
const axios = require("axios");
const puppeteer = require('puppeteer');

// for the API key
const options = {
  method: 'GET',
  url: 'https://crypto-news16.p.rapidapi.com/news/top/3',
  headers: {
    'X-RapidAPI-Key': X_RapidAPI_KEY,
    'X-RapidAPI-Host': 'crypto-news16.p.rapidapi.com'
  }
};

// retrieve the URL's for the top 20 trending news stories from coindesk
let article_URL_Array = [];
let article_Title_Array = [];
let article_Content_Array = [];

// retrieve the URL's from Rapid API
axios.request(options).then( 
    async function (response) {

    // remove old Titles and URL's from the previous day
    article_Title_Array = [];
    article_URL_Array = [];

    // loop through fetch data and push the URL's into an array
    response.data.forEach(data => {
        let title = data.title;
        let url = data.url;
        article_Title_Array.push(title);
        article_URL_Array.push(url);
    });

    for (let i = 0; i < article_URL_Array.length; i++) {
        await scrapeArticle(article_URL_Array[i])
    };

    await testFunction();

}).catch(
    function (error) {
	console.error(error);
    console.log('Could not fetch URL list...')
});

// SCRAPE ARTICLE CONTENT --  SCRAPE ARTICLE CONTENT -- SCRAPE ARTICLE CONTENT

// to contain the new article for each loop
let articleContent = [];

async function scrapeArticle(url) {

    // set up the browser and navigate to URL
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // select all the elements with the class of .at-text
    const paragraphElements = await page.$$('.at-text');

    // array to contain article content
    articleContent = [];

    // Loop through all paragraph elements
    for (const paragraph of paragraphElements) {
        const textContent = await paragraph.evaluate(el => el.textContent);
        articleContent.push(textContent);
        // console.log(textContent);
    };
    let entireArticle = articleContent.join(' ');
    article_Content_Array.push(entireArticle);

    // console.log(article_URL_Array);
    // console.log(article_Title_Array);
    // console.log(article_Content_Array);

    browser.close();
}

function testFunction() {
    console.log(article_URL_Array);
    console.log(article_Title_Array);
    console.log(article_Content_Array);
}

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