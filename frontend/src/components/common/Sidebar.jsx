import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {
  const location = useLocation();
  const arr = location.pathname.split("/")
  const final = arr[arr.length-1]
  console.log("yh  leeeeeee  ", final)
  const queryClient = useQueryClient();
  const {
    mutate: logoutMutation,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(
            data.error || "Something went wrong while logging out"
          );
      } catch (error) {
        console.log("Logout handler catch", error);

        throw new Error();
      }
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      //invaldating /me
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: () => {
      toast.error("Logout Failed");
    },
  });

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <h1>LogoToHome</h1>
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li
            className={`flex justify-center md:justify-start ${
              location.pathname == "/" && "bg-[#52307c]"
            }`}
          >
            <Link
              to="/"
              className="flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li
            className={`flex justify-center md:justify-start ${
              location.pathname == "/notifications" && "bg-[#52307c]"
            }`}
          >
            <Link
              to="/notifications"
              className="flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li
            className={`flex justify-center md:justify-start ${
              final == authUser.username && "bg-[#52307c]"
            }`}
          >
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>

          <li
            className={`flex justify-center md:justify-start ${
              location.pathname == "/saved" && "bg-[#52307c]"
            }`}
          >
            <Link
              to="/saved"
              className="flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaRegBookmark className="w-6 h-6" />
              <span className="text-lg hidden md:block">Saved Posts</span>
            </Link>
          </li>

          <li
            className={`flex justify-center md:justify-start ${
              location.pathname == "/liked" && "bg-[#52307c]"
            }`}
          >
            <Link
              to="/liked"
              className="flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaRegHeart className="w-6 h-6" />
              <span className="text-lg hidden md:block">Liked Posts</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer mr-4"
                onClick={(e) => {
                  e.preventDefault();
                  logoutMutation();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
