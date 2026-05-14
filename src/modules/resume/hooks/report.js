import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateInterviewReport, getReportById, getAllInterviewReports } from "../actions";

export const useGenerateInterviewReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => generateInterviewReport(values),

    onSuccess: (res) => {
      if (res?.success) {
        console.log("Report:", res.data);

        queryClient.invalidateQueries({ queryKey: ["reports"] });

        toast.success("Report generated successfully");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    },

    onError: (error) => {
      console.error("Report generate error:", error);
      toast.error("Failed to generate report");
    },
  });

  return {
    generateReport: mutation.mutateAsync,
    loading: mutation.isPending,        
    data: mutation.data,
    error: mutation.error,
  };
};


export const useGetReportById = (id) => {
    return useQuery({
    queryKey: ["report", id],
    queryFn: () => getReportById(id),

    enabled: !!id,
  })
}

export const useGetReports = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: getAllInterviewReports,
  })

  return {
    reports: query.data?.data || [],
    reportsLoading: query.isLoading,
    error: query.error,
  }
}