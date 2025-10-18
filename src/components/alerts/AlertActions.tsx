import { Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useUpdateAlert } from "../../hooks/useAlerts";

export default function AlertActions({ alertId }: { alertId: number }) {
  const { mutate: update } = useUpdateAlert(alertId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    // Mobile layout: stack buttons vertically with full width
    return (
      <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
        <Button 
          size="small" 
          onClick={() => update({ status: "acknowledged" })}
          sx={{ width: '100%' }}
        >
          Acknowledge
        </Button>
        <Button 
          size="small" 
          onClick={() => update({ status: "ordered" })}
          sx={{ width: '100%' }}
        >
          Mark Ordered
        </Button>
        <Button
          size="small"
          color="success"
          onClick={() => update({ status: "resolved" })}
          sx={{ width: '100%' }}
        >
          Resolve
        </Button>
      </Stack>
    );
  }

  // Desktop layout: horizontal buttons
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
