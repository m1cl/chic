export default function NavItem({children}: {children: React.ReactNode}) {
  return (
    <div role="button" tabIndex={0} className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-300 hover:bg-opacity-80 focus:bg-blue-300 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
      <div className="grid place-items-center mr-4">
        {children}
      </div>
    </div>
  );
}
