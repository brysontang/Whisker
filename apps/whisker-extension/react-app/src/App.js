/* global chrome */
import React, { useState } from 'react';

function App() {
  const [status, setStatus] = useState('');

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
    <div className="bg-amber-50 text-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-parchment border-4 border-gray-300 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-serif font-bold mb-8 text-gray-900 border-b-2 border-gray-300 pb-4 text-center">
            Whisker Popup
          </h1>
          <p className="text-lg text-gray-700 font-handwritten mb-6 text-center">
            Click to scrape recipes!
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleScrape}
              className="px-6 py-3 bg-amber-200 text-gray-900 rounded-lg text-lg font-bold hover:bg-amber-600 transition duration-300 shadow-md active:shadow-inner active:translate-y-0.5 cursor-pointer flex items-center justify-center"
            >
              Scrape Now
            </button>
          </div>
          {status && (
            <p className="mt-6 text-center text-lg font-handwritten text-gray-800">
              {status}
            </p>
          )}
          <div className="mt-8 text-center text-sm text-gray-600">
            <a
              href="https://www.flaticon.com/free-icons/whisk"
              title="whisk icons"
            >
              Whisk icons created by Freepik - Flaticon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
