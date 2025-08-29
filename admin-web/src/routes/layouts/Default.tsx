import { Outlet } from "react-router-dom"

function Default() {
  return (
    <div className="w-full h-screen bg-[#282828]">
      <Outlet/>
    </div>
  )
}

export default Default
