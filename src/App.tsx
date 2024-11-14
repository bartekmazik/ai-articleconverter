import "./App.css";
import axios from "axios";
import { useState } from "react";
import pdfToText from "react-pdftotext";
import { saveAs } from "file-saver";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const fetchOpenAIResponse = async (prompt: string) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
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
const extractText = (
  event: React.ChangeEvent<HTMLInputElement> | null,
  setText: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!event || !event.target.files) {
    console.error("Please select a file");
    return;
  }
  const file = event.target.files[0];
  const maxSizeInMB = 1;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    alert(`Max limit of file ${maxSizeInMB} MB.`);
    return;
  }
  pdfToText(file)
    .then((text) => setText(text))
    .catch((error) => console.log("Failed reading pdf", error));
};
const Download = (text: string | null) => {
  const handleDownload = () => {
    if (text === null) {
      console.error("No text to download");
      return;
    }
    const file = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(file, "artykul.html");
  };

  return <button onClick={handleDownload}>Download</button>;
};
function App() {
  const [completion, setCompletion] = useState<string | null>("TEXT");
  const [text, setText] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConvert = () => {
    setIsLoading(true);
    fetchOpenAIResponse(
      `${text} - Analyze this text and convert it to html format, but create only the part which will be inside the <body>(dont include the <body> tag in response)tag. Decide where to put images in this text and create appropiate <img> tags with src="image_placeholder.jpg" (dont change it) and set alt to your choice of context cause it will be used to generate images, next generate proper <p> tag with <img> alt content under the previous <img> element.`
    ).then((response) => {
      setCompletion(response);
      setIsLoaded(true);
      setIsLoading(false);
    });
  };

  return (
    <div className="container">
      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => extractText(event, setText)}
        className="upload"
      />
      {!isLoaded && (
        <button onClick={handleConvert}>
          {isLoading ? "Loading..." : "CONVERT"}
        </button>
      )}
      {isLoaded && <div>{Download(completion)}</div>}
    </div>
  );
}

export default App;
