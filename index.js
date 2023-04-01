// packages installed (npm install _______):
    // dotenv:             for keeping the API keys hidden
    // axios:              promise-based HTTPS requests using node.js
    // puppeteer:          headless browser controlled by code
    // openai:             post prompt to OpenAI to summerize articles 
    // twitter-api-v2:     twitter API
    // cron:               schedule tasks to run at specified times or intervals


// Require dotenv to import API keys and run .config to load the API keys into the index.js file 
require('dotenv').config();

// FUNTION TO SCRAPE ARTICLE CONTENT -- FUNTION TO SCRAPE ARTICLE CONTENT -- FUNTION TO SCRAPE ARTICLE CONTENT

const puppeteer = require('puppeteer');

// to contain the new article for each loop
let articleContent = [];

// function to scrape paragraph elements from URL
async function scrapeArticle(url) {

    // set up the browser and navigate to URL
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // select all the elements with the class of .at-text (Two Dollar Signs allows to fetch all elements, whereas one Dollar sign is the first element in the DOM)
    const paragraphElements = await page.$$('.at-text');

    // array to contain article content
    articleContent = [];

    // Loop through all paragraph elements
    for (const paragraph of paragraphElements) {
        let textContent = await paragraph.evaluate(el => el.textContent);
        let formattedTextContent = await textContent.replace(/'|’/g, '');
        articleContent.push(await formattedTextContent);
    };
    let formattedArticle = articleContent.join(' ');
    article_Content_Array.push(formattedArticle);

    browser.close();
};

// SUMMERIZE WITH OPENAI -- SUMMERIZE WITH OPENAI -- SUMMERIZE WITH OPENAI

// 2 imports from the OpenAI package
    // Configuration = object for defining things like API
    // OpenAIApi = provides an easy interface for interacting with the OpenAI API
const { Configuration, OpenAIApi } = require('openai');

// fetch the API key for the first argument in the post request 
const OpenAPI_Key = process.env.OPEN_AI_API_KEY;
const configuration = new Configuration({
    apiKey: OpenAPI_Key,
});

// Add the fethced API to the first argument of the post request
const openai = new OpenAIApi(configuration);

// The array holding the tweets
let tweet_Array = [];

// Function to request OpenAI to run prompt
async function runTwitterPrompt(scrapedArticle) {

    const prompt = `Summarize the article below into a single tweet under 250 characters in length, and add appropriate hashtags at the end of the tweet:
    ${scrapedArticle}
    `;

    // find the different models here: https://platform.openai.com/docs/models
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0
    });

    let summarizedTweet = response.data.choices[0].text;
    let formattedTweet = summarizedTweet.trim();
    tweet_Array.push(formattedTweet);
};

// POST ON TWITTER -- POST ON TWITTER -- POST ON TWITTER

const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});
const twitterClient = client.readWrite;

async function tweet(tweetContent) {
    try {
        console.log('tweeting!')
        await twitterClient.v2.tweet(`${tweetContent}`);
    } catch (error) {
        console.log(error);
    }
};

// APP WORKFLOW START --  APP WORKFLOW START  -- APP WORKFLOW START

// require axios to be used for the HTTPS request and puppeteer for scraping data
const axios = require("axios");

// for the API key
const X_RapidAPI_KEY = process.env.X_RapidAPI_KEY;

const options = {
  method: 'GET',
  url: 'https://crypto-news16.p.rapidapi.com/news/top/3',

  headers: {
    'X-RapidAPI-Key': X_RapidAPI_KEY,
    'X-RapidAPI-Host': 'crypto-news16.p.rapidapi.com'
  }
};

// running this function using CronJob
function dailyPost() {

    // retrieve the URL's for the top 20 trending news stories from coindesk
    let article_URL_Array = [];
    let article_Title_Array = [];
    let article_Content_Array = [];

    // retrieve the URL's from Rapid API
    axios.request(options).then(

        async function (response) {
    
        // remove old Titles, URL's, Articles, and Tweets from the previous day
        article_URL_Array = [];
        article_Title_Array = [];   
        article_Content_Array = []; 
        tweet_Array = [];
    
        // loop through fetch data and push the URL's into an array
        response.data.forEach(data => {
            let title = data.title;
            let url = data.url;
            article_Title_Array.push(title);
            article_URL_Array.push(url);
        });
    
        // looping over each URL to scrape
        for (let i = 0; i < article_URL_Array.length; i++) {
            await scrapeArticle(article_URL_Array[i]);
        };
    
        // looping over articles for OpenAI to summarize 
        for (const article of article_Content_Array) {
            await runTwitterPrompt(article);
        };
    
    }).then(
    
        async function postTweet() {
    
            for (const tweetPost of tweet_Array) {
                if (tweetPost === tweet_Array[0]) {
                    tweet(tweetPost)
                    console.log(tweetPost)
                } else if (tweetPost === tweet_Array[1]) {
                    setTimeout(function() {
                        tweet(tweetPost)
                        console.log(tweetPost)
                    }, 10800000) 
                } else if (tweetPost === tweet_Array[2]) {
                    setTimeout(function() {
                        tweet(tweetPost)
                        console.log(tweetPost)
                    }, 21600000)
                } else {
                    console.log('No additional tweets to send out')
                }
            }
        }
    
    ).catch(
        function (error) {
        console.error(error);
        console.log('Could not tweet articles...');
    });
};

// run this function once a day (3 tweets per day)
const CronJob = require('cron').CronJob;

const job = new CronJob('0 6 * * *', function() {
    dailyPost();
});
job.start();