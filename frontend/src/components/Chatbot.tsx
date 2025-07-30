import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Stack,
  useTheme,
  Button,
  CssBaseline,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChat } from "../hooks/useChat";
import type { Message } from "../types/types";
import AccessCodeModal from "./AccessCodeModal";
import { useStatus } from "../hooks/useStatus";

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const emptyMessageArr: Message[] = [];
    try {
      const storedMessages = window.localStorage.getItem("TravisGPT_messages");
      return storedMessages
        ? (JSON.parse(storedMessages) as Message[])
        : emptyMessageArr;
    } catch {
      return emptyMessageArr;
    }
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const useChatMutation = useChat();
  const theme = useTheme();
  const { data } = useStatus();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    window.localStorage.setItem("TravisGPT_messages", JSON.stringify(messages));
  }, [messages]);

  const clearHistory = () => {
    window.localStorage.removeItem("TravisGPT_messages");
    setMessages(() => []);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await useChatMutation.mutateAsync({
        question: text,
      });
      const data = res.data;

      const botReply: Message = {
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error contacting server. Check console.",
        },
      ]);
    }
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Stack
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CssBaseline />
        <Stack
          sx={{
            display: "flex",
            width: 3 / 4,
            height: "100%",
            maxWidth: "800px",
            m: 4,
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flex: 1 / 6,
              color: theme.palette.primary.main,
              justifyContent: "flex-end",
              pb: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              Travis‑GPT
            </Typography>
            <Typography variant="h6">
              Please prompt me with questions about Travis' software engineering
              skills or experience.
            </Typography>
          </Stack>

          {/* Chat window */}
          <Paper
            elevation={3}
            sx={{
              flex: 4 / 6,
              flexGrowY: 1,
              p: 2,
              border: "2px solid",
              backgroundColor: theme.palette.background.default,
              borderRadius: 4,
              borderColor: theme.palette.primary.main,
              maxHeight: "500px",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                overflow: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  overflow: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                {messages.map((m, idx) => (
                  <Box
                    key={idx}
                    alignSelf={m.role === "user" ? "flex-end" : "flex-start"}
                    maxWidth="75%"
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor:
                          m.role === "user"
                            ? theme.palette.secondary.main
                            : theme.palette.primary.dark,
                        color: theme.palette.background.default,
                      }}
                    >
                      <Typography variant="body1">{m.content}</Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={scrollRef} />
                {/* Clear button */}
              </Stack>
              <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Button
                  onClick={clearHistory}
                  sx={{
                    display: "flex",
                    color: theme.palette.primary.main,
                    "&:hover ": {
                      color: "red",
                    },
                  }}
                  disabled={messages.length == 0}
                >
                  Clear
                </Button>
              </Box>
            </Stack>
          </Paper>

          {/* Input */}
          <Box
            sx={{
              display: "flex",
              pt: 2,
              flex: 1 / 6,
            }}
            component="form"
            onSubmit={() => handleSubmit}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSubmit}
              sx={{
                justifyContent: "center",
                color: theme.palette.primary.main,
                "& .MuiOutlinedInput-root": {
                  color: theme.palette.primary.main,
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                },
              }}
            />
            <IconButton
              type="submit"
              disabled={!input.trim()}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                my: 5,
              }}
            >
              <SendIcon
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover ": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
      <AccessCodeModal open={!data?.valid ? true : false} />
    </>
  );
}
