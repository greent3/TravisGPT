import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Fade,
  useTheme,
} from "@mui/material";
import { useVerify } from "../hooks/useVerify";

interface AccessCodeModalProps {
  open: boolean;
}

export default function AccessCodeModal({ open }: AccessCodeModalProps) {
  const [code, setCode] = useState("");
  const useVerifyMutation = useVerify();
  const theme = useTheme();

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: theme.palette.background.default,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = async () => {
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      await useVerifyMutation.mutateAsync({
        code: code,
      });
      setCode("");
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  return (
    <Modal open={open} closeAfterTransition>
      <Fade in={open}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Access Code Required
          </Typography>
          <TextField
            fullWidth
            label="Enter Code"
            variant="outlined"
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{
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
            slotProps={{
              inputLabel: {
                sx: {
                  color: theme.palette.primary.main,
                },
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 2,
              "&:hover ": {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
