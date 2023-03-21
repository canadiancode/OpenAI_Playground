    // IMPORT DEPENDENCIES -- IMPORT DEPENDENCIES -- IMPORT DEPENDENCIES

// import Express.js by requiring express
const express = require('express');

// require dotenv to import API key and run .config to load the API key
require('dotenv').config();

// 2 imports from the OpenAI package
    // Configuration = object for defining things like API
    // OpenAIApi = provides an easy interface for interacting with the OpenAI API
const { Configuration, OpenAIApi } = require('openai');


    // SET UP A SERVER -- SET UP SERVER -- SET UP SERVER

// create a server object called app and call the function using "()";
const app = express();

// adds middleware to run on every request to OpenAI which parses the body of the request into json format
app.use(express.json());


    // SET UP ENDPOINT -- SET UP ENDPOINT -- SET UP ENDPOINT

// fetch the API key for the first argument in the post request 
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

// add the fethced API to the first argument of the post request
const openai = new OpenAIApi(configuration);

// use app variable to listen for a post request
app.post("/find-complexity", async (req, res) => {
    try {
        return res.status(200).json({
            message: "Working",
        });
    } catch (error) { }
});


    // RUN SERVER -- RUN SERVER -- RUN SERVER

// define a port for the server to run on
const port = process.env.PORT || 3000;

// start the server
app.listen(port, () => console.log(`Server listening on port ${port}`)); 