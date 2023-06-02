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
  let num_words = parseInt(req.body.num_words) || 40;
  let randomness = parseFloat(req.body.randomness) || 0;
  let hashtags = req.body.hashtags || "";

  // Convert user's desired number of words to an approximate number of tokens.
  let max_tokens = num_words * 5;

  if (max_tokens <= 0) {
    max_tokens = 200; // set to default
  }

  if (randomness < 0 || randomness > 1) {
    randomness = 0; // set to default
  }

  try {
    const promptWithHashtags = `${prompt}\n${hashtags}`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: promptWithHashtags,
      temperature: randomness,
      max_tokens: max_tokens,
      top_p: randomness,
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    let generatedText = response.data.choices[0].text.trim();

    // Convert the text into an array of words.
    let words = generatedText.split(/\s+/);

    // Trim the words array to the user-specified length.
    if (words.length > num_words) {
      words = words.slice(0, num_words);
      generatedText = words.join(" ");
    }

    generatedText = `${generatedText}\n${hashtags}`;

    res.render("index", {
      generatedText: generatedText,
    });
  } catch (error) {
    console.error(error);
    res.send("An error occurred.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
