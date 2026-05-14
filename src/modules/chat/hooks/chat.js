import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage, deleteChat, getChatById, createImage } from "../actions";
import { toast } from "sonner";

export const useCreateChat = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn:(values)=>createChatWithMessage(values),
        onSuccess:(res)=>{
            if(res.success && res.data){
                const chat = res.data;
                // console.log("Chat : ", chat);
                 
                queryClient.invalidateQueries(['chats']);
                router.push(`/chat/${chat.id}?autoTrigger=true`)
            }

        },
        onError:(error)=>{
            console.error("Create chat error : ", error);
            toast.error("Failed to create chat");
        }
    })
}

export const useDeleteChat = (chatId) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({ 
    mutationFn: () => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries(["chats"]);
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });
};

export const useGetChatById = (chatId) => {
  const queryClient = useQueryClient();
  // const router = useRouter();

  return useQuery({
    queryKey: ["chats", chatId],
    queryFn:() => getChatById(chatId),
  })
}


export const useGenerateImage = () => {
  return useMutation({
    mutationFn: async ({ prompt }) => {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data;
    },
  });
};