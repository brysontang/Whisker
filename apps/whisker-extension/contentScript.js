// contentScript.js

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'scrape_recipe') {
    // Example: Scrape the recipe title and URL from the webpage
    const recipeTitle =
      document.querySelector('h1')?.innerText || 'Untitled Recipe';
    const recipeUrl = window.location.href;

    // Send the recipe data to the backend API
    fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: recipeTitle, url: recipeUrl }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Recipe saved successfully:', data);
        sendResponse({ message: 'Recipe saved successfully' });
      })
      .catch((error) => {
        console.error('Error saving recipe:', error);
        sendResponse({ message: 'Failed to save recipe' });
      });

    // Return true to keep the message channel open for asynchronous response
    return true;
  }
});
