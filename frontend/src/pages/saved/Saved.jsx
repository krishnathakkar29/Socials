import React from "react";
import Posts from "../../components/common/Posts";

const Saved = ({authUser}) => {
  return (
    <div className="flex-[4_4_0] max-w-[60rem] mr-auto border-r border-gray-700 min-h-screen">
        <Posts feedType={"saved"} userId={authUser._id} />
    </div>
  );
};

export default Saved;
