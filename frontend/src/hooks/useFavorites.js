import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, deleteFavorite } from "@/services/api";

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 60000,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ from, to }) => addFavorite(from, to),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteFavorite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
