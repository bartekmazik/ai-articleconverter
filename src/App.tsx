import "./App.css";
import axios from "axios";
import { useState } from "react";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const fetchOpenAIResponse = async (prompt: string) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI fetch error:", error);
  }
};

function App() {
  const [completion, setCompletion] = useState<string | null>("TEXT");
  return (
    <>
      <button
        onClick={() => {
          fetchOpenAIResponse("Wygeneruj losowe przysłowie").then((response) =>
            setCompletion(response)
          );
        }}
      >
        UPLOAD FILE
      </button>
      <div>{completion}</div>
    </>
  );
}

export default App;
