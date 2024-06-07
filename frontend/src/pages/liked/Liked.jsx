import React from 'react'
import Posts from '../../components/common/Posts'


const Liked = ({authUser}) => {
  return (
    <div className="flex-[4_4_0] max-w-[60rem] mr-auto border-r border-gray-700 min-h-screen">
        <Posts feedType={"likes"} userId={authUser._id} />
    </div>
  )
}

export default Liked