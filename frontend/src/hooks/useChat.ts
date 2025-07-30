import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { ChatPrompt, ChatResponse } from "../types/types";
import { BASE_URL } from "../config";

export const useChat = () =>
  useMutation({
    mutationFn: async (data: ChatPrompt) => {
      const res = await axios.post<ChatResponse>(`${BASE_URL}/chat`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status != 200) {
        throw new Error(
          `Error processing chat message: ` + res.status + " " + res.statusText
        );
      }
      return res;
    },
  });
