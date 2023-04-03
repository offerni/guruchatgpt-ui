type ChatCompletionChoice = {
  delta: Delta
  index: number;
  finish_reason: string | null;
};

type Delta = {
  role?: string;
  content?: string;
}

type ChatCompletionEventResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
};
