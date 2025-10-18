import { Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useUpdateAlert } from "../../hooks/useAlerts";

export default function AlertActions({ alertId }: { alertId: number }) {
  const { mutate: update } = useUpdateAlert(alertId);
  const theme = useTheme();
  const isMobile = false; // Temporarily force desktop layout to test

  // Since this component is used in both AlertsTable (desktop) and AlertsList (mobile),
  // we need to handle both layouts
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
    <Stack direction="row" spacing={1}>
      <Button 
        size="small" 
        onClick={() => update({ status: "acknowledged" })}
      >
        Acknowledge
      </Button>
      <Button 
        size="small" 
        onClick={() => update({ status: "ordered" })}
      >
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
