import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Posts = ({ feedType, username, userId }) => {
  const location = useLocation();
  const arr = location.pathname.split("/");
  const final = arr[arr.length - 1];
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
        break;

      case "following":
        return "/api/posts/following";

      case "posts":
        return `/api/posts/user/${username}`;

      case "likes":
        return `/api/posts/likes/${userId}`;

      case "saved":
        return `/api/posts/saved/${userId}`;

      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndPoint();

  
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something Went Wrong");
        console.log(data);

        return data;
      } catch (error) {
        console.log("posts.jsx : ", error);
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();

  }, [feedType, refetch, final]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
