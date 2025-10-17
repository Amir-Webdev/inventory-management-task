import { Button, Stack } from "@mui/material";
import { useUpdateAlert } from "../../hooks/useAlerts";

export default function AlertActions({ alertId }: { alertId: number }) {
  const { mutate: update } = useUpdateAlert(alertId);
  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" onClick={() => update({ status: "acknowledged" })}>
        Acknowledge
      </Button>
      <Button size="small" onClick={() => update({ status: "ordered" })}>
        Mark Ordered
      </Button>
      <Button
        size="small"
        color="success"
        onClick={() => update({ status: "resolved" })}
      >
        Resolve
      </Button>
    </Stack>
  );
}
