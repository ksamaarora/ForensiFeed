import React, { useState, useEffect } from 'react';
import './GenerateReport.css'; // Import the CSS file

const GenerateReport = () => {
    const [userName, setUserName] = useState('');
    const [numberOfTweets, setNumberOfTweets] = useState('');
    const [fileName, setFileName] = useState('');

    const postData = async () => {
        const url = 'http://127.0.0.1:8001/api/v1/twitter/generatereport';
        const data = {
            username: userName,
            number_of_tweets: Number(numberOfTweets),
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
            const filename = result.user_reports;

            console.log("Filename from API response:", filename);
            setFileName(filename);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await postData();

        // Wait until fileName is updated
        setTimeout(() => {
            if (fileName) {
                const pdfUrl = `/pdf_files/${fileName}`; // Adjust path if necessary
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.log("FileName is not set or is empty");
            }
        }, 100); // Delay to ensure state update
    };

    const Stats = () => {
        console.log("Root Directory:", process.env.PUBLIC_URL);
        console.log("fileName:", fileName);
    };

    useEffect(() => {
        console.log("fileName updated:", fileName);
    }, [fileName]);

    return (
        <div className="container">
            <div className="form-group">
                <label htmlFor="userName" className="label">User Name:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="numberOfTweets" className="label">Number of Tweets:</label>
                <input
                    type="number"
                    id="numberOfTweets"
                    value={numberOfTweets}
                    onChange={(e) => setNumberOfTweets(e.target.value)}
                    className="input"
                />
            </div>

            <form onSubmit={handleSubmit} className="form">


                <center>
                <h3 className="title">Panchanama Formatter</h3>
                  <button type="submit" className="button">Generate Report</button>

                </center>
            </form>
            <center>
              <br></br>
            <button onClick={Stats} className="button">Check Stats</button>
            </center>

            {fileName && (
                <div className="download-link">
                    <a href={`/pdf_files/${fileName}`} download>
                    <center>
                      <br></br>
                        <strong>Download Report</strong>
                    </center>
                    </a>
                </div>
            )}
        </div>
    );
};

export default GenerateReport;
