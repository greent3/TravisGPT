export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ChatPrompt = {
  question: string;
};

export type ChatResponse = {
  reply: string;
};

export type VerificationCode = {
  code: string;
};

export type VerificationResponse = {
  expirationTime: string;
};

export type StatusResponse = {
  valid: boolean;
};
