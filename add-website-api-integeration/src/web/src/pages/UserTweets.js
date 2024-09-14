import React, { useState } from 'react';

const UserTweets = () => {
  const [userName, setUserName] = useState('');
  const [numberOfTweets, setNumberOfTweets] = useState('');
  const [resultcomp, setResultComp] = useState(null);
  const [tweets, setTweets] = useState([]); // State for individual tweets

  const postData = async () => {
    const url = 'http://127.0.0.1:8001/api/v1/twitter/usertweets';
    const data = {
      "username": userName,
      "number_of_tweets": Number(numberOfTweets),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      setResultComp(JSON.stringify(result));

      // Parse and store the tweets
      const parsedTweets = JSON.parse(result.usertweets);
      const tweetData = Object.keys(parsedTweets.twitter_link).map((index) => ({
        twitterLink: parsedTweets.twitter_link[index],
        text: parsedTweets.text[index],
        date: parsedTweets.date[index],
        likes: parsedTweets.likes[index],
        comments: parsedTweets.comments[index],
      }));

      setTweets(tweetData); // Save parsed tweets to state
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    postData();
  };

  const check = () => {
    console.log("Result comp:");
    console.log(resultcomp);
    const parsedResult = JSON.parse(resultcomp);
    console.log("parsed result:");
    console.log(parsedResult); // Check the structure
    console.log(parsedResult.comments["0"][1]); // Accessing comments array
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundImage: `url(${process.env.PUBLIC_URL + '/bg.jpg'})`,
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="userName"
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'white' }}
          >
            User Name:
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="numberOfTweets"
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'white' }}
          >
            Number of Tweets:
          </label>
          <input
            type="number"
            id="numberOfTweets"
            value={numberOfTweets}
            onChange={(e) => setNumberOfTweets(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>

      {/* Render fetched tweets beautifully */}
      {tweets.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: 'gray', marginBottom: '20px' }}>Fetched Tweets:</h3>
          {tweets.map((tweet, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#001627',
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <p><strong>Tweet Text:</strong> {tweet.text}</p>
              <p><strong>Date:</strong> {tweet.date}</p>
              <p><strong>Likes:</strong> {tweet.likes}</p>
              <p><strong>Comments:</strong> {tweet.comments}</p>
              <a
                href={tweet.twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#089859',
                  textDecoration: 'none',
                }}
              >
                View Tweet
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Optional: Raw JSON data and copy functionality */}
      {resultcomp && (
        <div className="raw-data-container" style={{ marginTop: '20px' }}>
          <h3 style={{ color: 'gray', marginBottom: '10px' }}>Tweet Data:</h3>
          <button
            style={{
              backgroundColor: '#089859',
              color: 'black',
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '10px',
              marginLeft: 'auto', // Aligns the button to the right
              display: 'block',
            }}
            onClick={() => {
              const textToCopy = JSON.stringify(JSON.parse(JSON.parse(resultcomp).usertweets), null, 2);
              navigator.clipboard.writeText(textToCopy);
            }}
          >
            Copy Tweets
          </button>
          <pre
            className="copy-json-data"
            style={{
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              backgroundColor: 'black',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              overflowX: 'auto',
              fontSize: '14px',
              lineHeight: '1.5',
              color: 'white',
            }}
          >
            {JSON.stringify(JSON.parse(JSON.parse(resultcomp).usertweets), null, 2)}
          </pre>
        </div>
      )}

      <button onClick={check}>Check Stats</button>
    </div>
  );
};

export default UserTweets;
