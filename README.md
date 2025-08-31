# AI Nutritionist & Coach

This is a Vite-based React application that uses the Google Gemini API to provide nutritional analysis and personalized coaching.

## Prerequisites

- Node.js (version 18 or later recommended)
- npm (usually comes with Node.js)
- A Google AI API Key

## Setup & Installation

1.  **Clone or Download the Project**: Get all the project files onto your local machine.

2.  **Install Dependencies**: Open your terminal in the project's root directory and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

3.  **Set Up Your API Key**:
    - In the project's root directory, you will see a file named `.env.local`.
    - Open this file and replace `"YOUR_GOOGLE_AI_API_KEY_HERE"` with your actual Google AI API key.
    - The line should look like this: `VITE_API_KEY="AIzaSy...your...key..."`

## Available Scripts

### Run in Development Mode
To start the application locally with live-reloading:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or whatever URL the terminal shows) to view it in your browser.

### Build for Production
To build the application for deployment:
```bash
npm run build
```
This command creates a `dist` folder in the project root. This folder contains the optimized, static files that you can upload to any web hosting service (like Vercel, Netlify, or GitHub Pages).
