import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>("");

  const handleClickOrEnter = () => {
    const uuid = uuidv4();

    setAnswer("");
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_GURU_CHAT_GPT_SEARCH_BASE_URL}/search?sessionID=${uuid}&message=${question}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        return;
      }

      const data = JSON.parse(event.data) as ChatCompletionEventResponse;
      if (data.choices[0].delta.content) {
        setAnswer(
          (currentValue) => `${currentValue}${data.choices[0].delta.content}`
        );
      }
    };

    eventSource.onerror = () => {
      // closes the connection once the back end is done sending the events
      eventSource.close();
    };

    return () => {};
  };

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center w-1/2 mx-auto">
        <div className="w-full flex justify-center">
          <input
            autoFocus
            className="h-10 w-full border-2 focus:outline-none focus:border-gray-300"
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

        {answer && (
          <div className="flex mt-4 justify-center items-center">{answer}</div>
        )}
      </div>
    </>
  );
}
