import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createHelpRequest,
  getHelpRequestsByCity,
} from "@/services/dbServices";


export const useHelpRequests = (city) => {
  return useQuery({
    queryKey: ["helpRequests", city],
    queryFn: () => getHelpRequestsByCity(city),
    enabled: !!city, 
  });
};


export const useCreateHelpRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHelpRequest,
    onSuccess: (_, variables) => {

      queryClient.invalidateQueries([
        "helpRequests",
        variables.city,
      ]);
    },
  });
};
