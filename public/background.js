/*global chrome*/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const post_data = {
        encodingType: 'UTF8',
        document: {
        type: 'PLAIN_TEXT',
        content: request.message
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post_data)
    };
    
    fetch('https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyA_qhqBKdS9IPthLS_N72r2sl2KiJhmHYo', requestOptions)
    .then((response) => {
        return response.json();
    })
    .then((results) => {

        const sentiment = results;
        console.log('Sentiment score : ' + sentiment.documentSentiment.score);
        console.log('Sentiment magnitude : ' + sentiment.documentSentiment.magnitude);
        console.log('Sentiment language : ' + sentiment.language);
        sendResponse({sentiment_score: sentiment.documentSentiment.score, sentiment_magnitude: sentiment.documentSentiment.magnitude, 
            sentiment_language: sentiment.language});
    })
    .catch((err) => {
        sendResponse({error: err});
    });
    return true;
});



