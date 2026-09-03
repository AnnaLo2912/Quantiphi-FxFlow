import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertCurrency } from "@/services/api";

export function useConversion(from, to, amount) {
  return useQuery({
    queryKey: ["convert", from, to, amount],
    queryFn: () => convertCurrency(from, to, amount),
    enabled: !!from && !!to && amount > 0,
    staleTime: 30000,
    retry: 1,
  });
}

export function useConvertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ from, to, amount }) => convertCurrency(from, to, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversionHistory"] });
    },
  });
}
