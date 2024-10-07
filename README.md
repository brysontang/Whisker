# Whisker

Find recipes then store them in your own personal cookbook with your own personal twist.

## How to Use

This project consists of two main applications:

### 1. nextjs-app

This is a Next.js application that handles the extraction of text from the raw page, communicates with the MongoDB database, and serves the webpage to display the recipe application.

#### Setup:

1. Navigate to the `apps/nextjs-app` directory.
2. Create a `.env` file with the following fields:

   ```
   OPENAI_API_KEY=your_openai_api_key
   MONGODB_URI=your_mongodb_uri
   MONGODB_DB=your_mongodb_database_name
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Run the development server:

   ```
   npm run dev
   ```

   Or for production:

   ```
   npm run build
   npm run start
   ```

### 2. whisker-extension

This is the Chrome extension that scrapes the page and calls the Next.js backend.

#### Setup:

1. Navigate to the `whisker-extension` directory.
2. Install dependencies:

   ```
   npm install
   ```

3. Build the extension:

   ```
   npm run build
   ```

#### Adding to Chrome:

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" in the top left corner.
4. Navigate to the `whisker-extension/build` directory and select it.
5. The Whisker extension should now be added to Chrome and ready to use.
