import "dotenv/config";
import "./instrument.js";
import Express from "express";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import * as Sentry from "@sentry/node";

const express = new Express();
const openai = new OpenAI();
const prisma = new PrismaClient();

// Define GPT4 prompt for requesting health effects of ingredients
const REQUEST_PROMPT = `Summarize the health effects of these ingredients. Be critical. If there is even a slight impact please state it.
  There may be some additional syntax or words attached to their name such as a ( or the words "less than 2% of". Do NOT replace brackets with curly braces or parentheses.
  Respond ONLY with an array that has JSON objects with the parameters ingredient, display_name, and description.
  ingredient should be the name as it came from our array. Do NOT modify that at all. Include every ingredient that has been sent to you EXACTLY as it has been sent to you.
  display_name should be a pretty version of the ingredient name. If there is any extra punctuation or words that shouldn't be attached, remove them in this string. Also correct the capitalization.
  description should be a description of the health impacts of the ingredient and any potential risks associated with it.`;

// Define Express route for GET requests with a UPC code in the path
express.get("/info/:upc", async (req, res) => {
  const upc = req.params.upc;
  console.log(`Received GET request for /name/${upc}`);

  // Fetch food data from FDC (FoodData Central) API
  let fdc_res = null;
  try {
    fdc_res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc}&pageSize=1&api_key=${process.env.FDC_API_KEY}`
    );
  } catch (err) {
    console.error("Error fetching from FDC API: ");
    console.error(err);
    return Response.error();
  }
  // Parse JSON response from FDC API
  const food_data = await fdc_res.json();

  // Make sure that the food item was found
  if (food_data.foods[0]) {
    function toTitleCase(str) {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    let name = food_data.foods[0].description.trim();
    let brand = food_data.foods[0].brandName.trim();
    let response = {
      name: toTitleCase(name),
      brand: toTitleCase(brand),
    };
    console.log("Found name and brand:");
    console.table(response);
    res.json(response);
  } else {
    console.error(`No food item found for UPC ${upc}.`);
    return Response.error();
  }
});

express.get("/health/:upc", async (req, res) => {
  const upc = req.params.upc;
  console.log(`Received GET request for /info/${upc}`);

  // Fetch food data from FDC (FoodData Central) API
  let fdc_res = null;
  try {
    fdc_res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc}&pageSize=1&api_key=${process.env.FDC_API_KEY}`
    );
  } catch (err) {
    console.error("Error fetching from FDC API: ");
    console.error(err);
    return Response.error();
  }
  // Parse JSON response from FDC API
  const food_data = await fdc_res.json();

  // Make sure that the food item was found
  if (food_data.foods[0]) {
    console.log(`Found ingredients: ${food_data.foods[0].ingredients}`);

    let aiIngredients = [];
    let response = [];

    // Check if ingredients are already in database
    let ingredients = food_data.foods[0].ingredients.split(", ");
    for (let ingredient of ingredients) {
      const ingredientExists = await prisma.ingredients.findUnique({
        where: {
          ingredient: ingredient,
        },
      });

      if (ingredientExists) {
        response.push({
          ingredient: ingredient,
          display_name: ingredientExists.display_name,
          description: ingredientExists.description,
        });
      } else {
        aiIngredients.push(ingredient);
      }
    }

    for (let i = 0; i < 3; i++) {
      if (aiIngredients.length > 0) {
        console.log(
          `Sending the following ingredients to OpenAI: ${aiIngredients}`
        );
        // Construct prompt and send to OpenAI API
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `${REQUEST_PROMPT}\n[${aiIngredients
                .map((i) => `"${i}"`)
                .join(", ")}]`,
            },
          ],
          model: "gpt-4",
        });

        // Parse JSON response from OpenAI API
        let content = chatCompletion.choices[0].message.content;
        console.log("Received a response from OpenAI.");

        // Check if chatGPT returned a response
        if (!content) {
          console.error("Did not receive a response from OpenAI.");
          return Response.error();
        }

        // Add ingredients from chatGPT to response and database
        let contentObj = {};
        try {
          contentObj = JSON.parse(content);
        } catch {
          continue;
        }
        for (let ingredient of contentObj) {
          response.push(ingredient);
          await prisma.ingredients.upsert({
            create: {
              ingredient: ingredient.ingredient,
              display_name: ingredient.display_name,
              description: ingredient.description,
            },
            where: {
              ingredient: ingredient.ingredient,
            },
            update: {
              ingredient: ingredient.ingredient,
              display_name: ingredient.display_name,
              description: ingredient.description,
            },
          });
        }

        if (contentObj.length != aiIngredients.length) {
          let ingredientArray = contentObj.map((obj) => obj.ingredient);
          aiIngredients = aiIngredients.filter(
            (ingredient) => !ingredientArray.includes(ingredient)
          );
        }
      } else {
        break;
      }
    }

    // Send response back to the client
    res.json(response);
  } else {
    console.error(`No food item found for UPC ${upc}.`);
    return Response.error();
  }
});

Sentry.setupExpressErrorHandler(express);

// Start Express server
express.listen(process.env["PORT"], () => {
  console.log(`Qodi API is now listening on port ${process.env["PORT"]}`);
});
