import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { VerificationCode, VerificationResponse } from "../types/types";
import { BASE_URL } from "../config";

export const useVerify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerificationCode) => {
      const res = await axios.post<VerificationResponse>(
        `${BASE_URL}/verify`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status != 200) {
        throw new Error(
          `Error processing chat message: ` + res.status + " " + res.statusText
        );
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });
};
