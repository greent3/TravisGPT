import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../config";

import type { StatusResponse } from "../types/types";
import axios from "axios";

export const useStatus = () => {
  return useQuery<StatusResponse>({
    queryKey: ["status"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/status`);
      if (res.status != 200) {
        throw new Error("Failed to fetch auth status");
      }
      return res.data;
    },
  });
};
