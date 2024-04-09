import NavItem from "@/app/components/nav-item";

export default function Sidebar() {
  return (
    <nav className="relative flex flex-col bg-clip-border rounded-xl bg-[#121212] text-gray-300 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-[blue]/5">
      <div className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
        <NavItem> Songs</NavItem>
        <NavItem> Songs</NavItem>
        <NavItem> Songs</NavItem>
        <NavItem> Songs</NavItem>
        <NavItem> Songs</NavItem>
      </div>
    </nav>
  )
}
