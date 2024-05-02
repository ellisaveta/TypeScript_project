import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";

interface Props {
  goBack: () => void;
}

export function BackButton({ goBack }: Props) {
  return (
    <Button
      variant="text"
      startIcon={<ArrowBack />}
      onClick={goBack}
      sx={{ marginTop: "20px", color: "gray" }}
    >
      Back
    </Button>
  );
}
