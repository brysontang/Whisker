/* global chrome */
import React from 'react';

function App() {
  const [status, setStatus] = React.useState('');

  const handleScrape = () => {
    setStatus('Scraping...');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { message: 'scrape_recipe' },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError);
              setStatus(
                'Error: Content script not ready. Please refresh the page and try again.'
              );
              return;
            }
            if (response?.message === 'Recipe saved successfully') {
              setStatus('Recipe saved successfully!');
            } else {
              console.log('Response:', response);
              setStatus('Failed to save recipe. Please try again.');
            }
          }
        );
      } else {
        setStatus('Error: No active tab found');
      }
    });
  };

  return (
    <div className="App">
      <a href="https://www.flaticon.com/free-icons/whisk" title="whisk icons">
        Whisk icons created by Freepik - Flaticon
      </a>
      <h1>Whisker Popup</h1>
      <p>Click to scrape recipes!</p>
      <button onClick={handleScrape}>Scrape Now</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default App;
