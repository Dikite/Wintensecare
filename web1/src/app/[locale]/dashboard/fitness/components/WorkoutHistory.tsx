import {
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { MuiMetricCard } from "../../../components/MuiMetricCard";
import { WorkoutSession } from "@/types/exercise";
import { useTranslations } from "next-intl";

export default function WorkoutHistory({
  history,
  onViewAll,
}: {
  history: WorkoutSession[];
  onViewAll?: () => void;
}) 

{
  const t = useTranslations("workoutHistory");
  return (
   <MuiMetricCard title={t("title")}>
      {/* Header action */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ mb: 1 }}
      >
        <Button size="small" onClick={onViewAll}>
       {t("viewHistory")}
        </Button>
      </Stack>

      <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
        <Stack spacing={2}>
          {history.slice(0, 5).map((w) => (
            <Box key={w.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography fontWeight={700}>
                  {w.type.toUpperCase()}
                </Typography>

                <Chip
                  size="small"
                 label={`${Math.round(w.duration / 60)} ${t("minutes")}`}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
               {t("calories")}: {w.calories ?? "--"} | {t("avgHR")}: {w.avgHR ?? "--"}
                {w.avgHR ?? "--"}
              </Typography>

             <Typography
  variant="caption"
  color="text.secondary"
>
  {new Date(w.startTime).toLocaleString()} ·{" "}
 {Math.round(w.duration / 60)} {t("minutes")}
</Typography>


              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}

          {!history.length && (
            <Typography color="text.secondary">
             {t("empty")}
            </Typography>
          )}
        </Stack>
      </Box>
    </MuiMetricCard>
  );
}
