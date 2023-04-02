import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<GuruChatGptResponse | null>(null);

  const handleClickOrEnter = () => {
    fetch(`http://localhost:9091/search?message=${question}`).then(
      (response) => {
        response.json().then((resp: GuruChatGptResponse) => {
          setAnswers(resp);
        });
      }
    );
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="flex justify-center items-center mt-6">
          <input
            className="w-1/2 h-10 border-2"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            type="text"
            placeholder="Type Something"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClickOrEnter();
                e.stopPropagation();
              }
            }}
          />
          <button
            className="border-2 h-10 bg-gray-200"
            onClick={handleClickOrEnter}
            tabIndex={0} // make sure to add this attribute
          >
            Go
          </button>
        </div>
        {answers?.choices && (
          <div className="flex justify-center items-center">
            {answers.choices[0].message.content}
          </div>
        )}
      </div>
    </>
  );
}
