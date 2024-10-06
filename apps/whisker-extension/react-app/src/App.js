/* global chrome */
import React from 'react';

function App() {
  const handleScrape = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tabs', tabs);
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { message: 'scrape_recipe' },
          (response) => {
            if (response?.message === 'Recipe saved successfully') {
              console.log('Recipe saved successfully!');
            } else {
              console.log(response);
              console.log('Failed to save recipe.');
            }
          }
        );
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
    </div>
  );
}

export default App;
