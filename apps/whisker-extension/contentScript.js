// contentScript.js

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'scrape_and_process_recipe') {
    // Scrape the recipe title and URL from the webpage
    const recipeTitle =
      document.querySelector('h1')?.innerText || 'Untitled Recipe';
    const recipeUrl = window.location.href;
    const recipeText = document.body.innerText;

    // Send the scraped data and user instructions to the backend API
    fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: recipeTitle,
        url: recipeUrl,
        recipeText: recipeText,
        instructions: request.instructions,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Recipe processed and saved successfully:', data);
        sendResponse({ message: 'Recipe processed and saved successfully' });
      })
      .catch((error) => {
        console.error('Error processing and saving recipe:', error);
        sendResponse({ message: 'Failed to process and save recipe' });
      });

    // Return true to keep the message channel open for asynchronous response
    return true;
  }
});
