import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Logo from "../../assets/Logoimg.jpg";
// import Logo from '../../assets/logoUC.svg'

const Sidebar = () => {
  const location = useLocation();
  const arr = location.pathname.split("/");
  const final = arr[arr.length - 1];
  console.log("yh  leeeeeee  ", final);
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
          {/* <h1>LogoToHome</h1> */}
          {/* <img src={Logo} className=" md:h-24 w-24" alt="" /> */}
          <svg
            width="200"
            height="55"
            viewBox="0 0 76 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.296 5.296V9.772C7.296 10.556 7.2 11.184 7.008 11.656C6.824 12.128 6.5 12.472 6.036 12.688C5.572 12.896 4.916 13 4.068 13C3.188 13 2.504 12.896 2.016 12.688C1.536 12.472 1.2 12.128 1.008 11.656C0.816 11.184 0.72 10.556 0.72 9.772V5.296H2.64V9.736C2.64 10.144 2.68 10.464 2.76 10.696C2.84 10.928 2.984 11.092 3.192 11.188C3.4 11.276 3.692 11.32 4.068 11.32C4.42 11.32 4.688 11.276 4.872 11.188C5.064 11.092 5.196 10.928 5.268 10.696C5.34 10.464 5.376 10.144 5.376 9.736V5.296H7.296Z"
              fill="#BCA0DB"
            />
            <path
              d="M13.528 10.936C13.88 11.056 14.264 11.152 14.68 11.224C15.104 11.288 15.524 11.32 15.94 11.32C16.508 11.32 16.928 11.296 17.2 11.248C17.48 11.192 17.664 11.108 17.752 10.996C17.84 10.884 17.884 10.74 17.884 10.564C17.884 10.412 17.852 10.292 17.788 10.204C17.724 10.116 17.6 10.048 17.416 10C17.232 9.944 16.96 9.9 16.6 9.868L15.808 9.796C15.216 9.74 14.748 9.616 14.404 9.424C14.068 9.232 13.828 8.976 13.684 8.656C13.548 8.328 13.48 7.936 13.48 7.48C13.48 6.936 13.588 6.496 13.804 6.16C14.028 5.824 14.388 5.58 14.884 5.428C15.38 5.268 16.04 5.188 16.864 5.188C17.936 5.188 18.82 5.328 19.516 5.608L19.48 7.24L19.444 7.288C18.652 7.008 17.824 6.868 16.96 6.868C16.544 6.868 16.224 6.892 16 6.94C15.776 6.98 15.62 7.048 15.532 7.144C15.444 7.24 15.4 7.376 15.4 7.552C15.4 7.728 15.428 7.86 15.484 7.948C15.548 8.036 15.672 8.104 15.856 8.152C16.04 8.192 16.308 8.232 16.66 8.272L17.416 8.356C18.056 8.428 18.548 8.556 18.892 8.74C19.236 8.924 19.472 9.172 19.6 9.484C19.736 9.788 19.804 10.16 19.804 10.6C19.804 11.136 19.688 11.584 19.456 11.944C19.232 12.296 18.864 12.56 18.352 12.736C17.84 12.912 17.156 13 16.3 13C15.74 13 15.236 12.972 14.788 12.916C14.34 12.852 13.904 12.768 13.48 12.664V10.972L13.528 10.936Z"
              fill="white"
            />
            <rect x="9.5" y="2.5" width="14" height="13" stroke="white" />
          </svg>
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
