import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followUnfollow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(
            data.message || "Somwthing went wrong while following"
          );

        return data;
      } catch (error) {
        console.log("Hook- useFollow: ", error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Following user!");
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["getSuggested"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["authUser"],
        }),
      ]);
    },
    onError: () => {
      toast.error(error.message);
    },
  });

  return {followUnfollow, isPending}
};

export { useFollow };
