import {
  Card,
  CardContent,
  Avatar,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

interface MetricCardProps {
  icon: React.ReactNode;
  color: "primary" | "info" | "success" | "warning";
  value: string | number;
  label: string;
  progress: number;
}

export default function MetricCard({
  icon,
  color,
  value,
  label,
  progress,
}: MetricCardProps) {
  return (
    <Card sx={{ height: "100%", overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h3" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {label}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": { bgcolor: `${color}.main` },
          }}
        />
      </CardContent>
    </Card>
  );
}
