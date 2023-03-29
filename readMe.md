Things I am working on:

- current issue is that when we extract the scraped data from the URL< we get apostrophe's inside the string that is getting added to the OpenAI prompt, so we need to remove all apostrophes before we add the article content into the main article_Content_Array prior to sending the articles to ChatGPT.
