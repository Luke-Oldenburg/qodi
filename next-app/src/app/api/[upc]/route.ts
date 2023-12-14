import OpenAI from "openai";

import type { NextRequest } from "next/server";

const openai = new OpenAI();

// Define GPT-3.5 prompt for requesting health effects of ingredients
const REQUEST_PROMPT =
  'Summarize the health effects of these ingredients. Be critical. If there is even a slight impact please state it. If there are ingredients labeled as "may contain" or "less than 2% of" please still include them and indicate it in your response. Separate the ingredients as they are separated by commas. Respond ONLY with an array that has JSON objects with the parameters ingredient and description.';

// Define Express route for GET requests with a UPC code in the path
export async function GET(
  req: NextRequest,
  { params }: { params: { upc: string } }
) {
  const upc = params.upc;
  console.log(`Received request for UPC ${upc}`);

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

    if (!content) {
      console.error("No response from OpenAI.");
      return Response.error();
    }

    // Send response back to the client
    return Response.json(JSON.parse(content));
  } else {
    console.error(`No ingredients found for UPC ${upc}.`);
    return Response.error();
  }
}
