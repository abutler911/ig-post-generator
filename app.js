require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { generatedText: "" });
});

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  let max_tokens = parseInt(req.body.num_words) || 200;

  let temperature = parseFloat(req.body.randomness) || 0;

  if (max_tokens <= 0) {
    max_tokens = 200;
  }

  if (temperature < 0 || temperature > 1) {
    temperature = 0;
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: temperature,
      max_tokens: max_tokens,
    });

    res.render("index", {
      generatedText: response.data.choices[0].text.trim(),
    });
  } catch (error) {
    console.error(error);
    res.send("An error occurred.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
