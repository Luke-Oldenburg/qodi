// Load environment variables from .env file
import "dotenv/config";

// Import dependencies
import Express from "express";
import OpenAI from "openai";

// Initialize Express server and OpenAI API
const express = new Express();
const openai = new OpenAI();

// Define GPT-3.5 prompt for requesting health effects of ingredients
const REQUEST_PROMPT =
  'Summarize the health effects of these ingredients. Be critical. If there is even a slight impact please state it. If there are ingredients labeled as "may contain" or "less than 2% of" please still include them and indicate it in your response. Separate the ingredients as they are separated by commas. Respond ONLY with an array that has JSON objects with the parameters ingredient and description.';

// Define Express route for GET requests with a UPC code in the path
express.get("/:upc", (req, res) => {
  console.log(`Received request for UPC ${req.params.upc}`);

  // Fetch food data from FDC (FoodData Central) API
  fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.params.upc}&pageSize=1&api_key=${process.env["FDC_API_KEY"]}`
  )
    .then((fdc_res) => {
      // Parse JSON response from FDC API
      fdc_res.json().then(async (food_data) => {
        // Make sure that ingredients were found
        if (food_data.foods[0]) {
          console.log(`Found ingredients: ${food_data.foods[0].ingredients}`);

          // Construct prompt and send to OpenAI API
          const chatCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `Ingredients: ${food_data.foods[0].ingredients}\n${REQUEST_PROMPT}`,
              },
            ],
            model: "gpt-3.5-turbo",
          });

          // Parse JSON response from OpenAI API
          let content = chatCompletion.choices[0].message.content;
          console.log(content);

          // Send response back to the client
          res.json(JSON.parse(content));
        } else {
          console.error(`No ingredients found for UPC ${req.params.upc}.`);
        }
      });
    })
    .catch((err) => {
      console.error("Error fetching from FDC API: ");
      console.error(err);
    });
});

// Start Express server
express.listen(process.env["PORT"], () => {
  console.log(`Qodi API is now listening on port ${process.env["PORT"]}`);
});
