import '../App.css';
import React, { useState } from 'react';

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [rawData, setRawData] = useState(null); // State to store raw JSON data

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setRawData(null); // Reset raw data

    const controller = new AbortController(); // Create an AbortController instance
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Set timeout for 20 seconds

    try {
      const res = await fetch(`/api/v1/twitter/userdetails/${name}`, { 
        signal: controller.signal // Attach signal to the fetch request
      });

      if (!res.ok) {
        throw new Error(`Network response was not ok (${res.status})`);
      }

      const data = await res.json();
      setRawData(data); // Set raw JSON data to display
      setResponse(data.userdetails);
      console.log("Hello!")
      console.log(data.userdetails);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError(new Error('Request timed out'));
      } else {
        setError(err);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="form-title">Twitter Parser</h2>
          <label className="form-label">
            Enter User Details:
            <input
              type="text"
              value={name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter User Details"
            />
          </label>
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>

          {error && <p className="status-text error-text">Error: {error.message}</p>}
{/* 
          {response && (
  <div className="response-container">
    <p className="response-title">Output:</p>
    <div className="response-item">
      <hr />
      <h3 className="response-location">User Details</h3>
      <p>Image Link: {response.image}</p>
      <p>Name: {response.name}</p>
      <p>Username: {response.username}</p>
      <p>ID: {response.id}</p>
      <p>Bio: {response.bio}</p>
      <p>Location: {response.location}</p>
      <p>Website: {response.website}</p>
      <p>Joined: {response.joined}</p>
      <p>Stats:</p>
      <p>Tweets: {response.stats.tweets}</p>
      <p>Following: {response.stats.following}</p>
      <p>Followers: {response.stats.followers}</p>
      <p>Likes: {response.stats.likes}</p>
      <p>Media: {response.stats.media}</p>
    </div>
  </div>
)} */}

{response && (
  <div className="response-container">
    <p className="response-title">Output:</p>
    <div className="response-item">
      <hr />
      <h3 className="response-location">User Details</h3>
      {Object.keys(response).map((key) => {
        if (typeof response[key] === 'object' && response[key] !== null) {
          return (
            <div key={key}>
              <p>{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
              {Object.keys(response[key]).map((subKey) => (
                <p key={subKey}>
                  {subKey.charAt(0).toUpperCase() + subKey.slice(1)}: {response[key][subKey]}
                </p>
              ))}
            </div>
          );
        } else {
          return (
            <p key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {response[key]}
            </p>
          );
        }
      })}
      <p>Image : 
      <img src={response.image} width="500" height="600"/>
      </p>
    </div>
  </div>
)}


          {/* Display raw JSON data in a pretty format */}
          {rawData && (
            <div className="raw-data-container">
              <h3>Raw JSON Data:</h3>
              <pre className="raw-data" style={{ textAlign: 'left', whiteSpace: 'pre-wrap', backgroundColor: 'black', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', overflowX: 'auto' }}>
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </header>
    </div>
  );
}

export default App;
