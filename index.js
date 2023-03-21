// Require dotenv to import API key and run .config to load the API key
require('dotenv').config();

// Fetch the API key from the hidden folder
const API_Key = process.env.OPEN_AI_KEY;

// 2 imports from the OpenAI package
    // Configuration = object for defining things like API
    // OpenAIApi = provides an easy interface for interacting with the OpenAI API
const { Configuration, OpenAIApi } = require('openai');

// fetch the API key for the first argument in the post request 
const configuration = new Configuration({
    apiKey: API_Key,
});

// Add the fethced API to the first argument of the post request
const openai = new OpenAIApi(configuration);

// Function to request OpenAI to run prompt
const runPrompt = async () => {

    const prompt = 'Tell me a joke about about a dog eating pasta';

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 2048,
        temperature: 1
    })

    console.log(response.data);

};
runPrompt();