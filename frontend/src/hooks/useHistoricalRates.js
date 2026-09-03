import { useQuery } from "@tanstack/react-query";
import { getHistoricalRates } from "@/services/api";

export function useHistoricalRates(from, to, days = 30) {
  return useQuery({
    queryKey: ["historical", from, to, days],
    queryFn: () => getHistoricalRates(from, to, days),
    enabled: !!from && !!to,
    staleTime: 300000,
    retry: 1,
  });
}
