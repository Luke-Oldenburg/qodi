import "dotenv/config";
import Express from "express";
import OpenAI from "openai";

const express = new Express();
const openai = new OpenAI();
const REQUEST_PROMPT = "Summarize the health effects of these ingredients. Be critical. If there is even a slight impact please state it. Separate the ingredients as they are separated by commas. Respond ONLY with an array that has JSON objects with the parameters ingredient and description.";

express.get("/:upc", (req, res) => {
    fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${req.params.upc}&pageSize=1&api_key=${process.env["FDC_API_KEY"]}`).then((fdc_res) => {
        fdc_res.json().then(async (food_data) => {
            if (food_data.foods[0]) {
                const chatCompletion = await openai.chat.completions.create({
                    messages: [{role: "user", content: `${food_data.foods[0].ingredients} ${REQUEST_PROMPT}`}],
                    model: "gpt-3.5-turbo",
                });

                console.log(chatCompletion.choices);
                res.send(chatCompletion.choices[0].message.content);
            }
        });
    }).catch((err) => {
        console.error(err);
    });
});

express.listen(process.env["PORT"], () => {
    console.log(`Qodi API is now listening on port ${process.env["PORT"]}.`);
});