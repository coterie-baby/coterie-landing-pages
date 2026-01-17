export default function AdminHeader() {
  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-[#DEDFE2] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">Coterie</span>
        <span className="text-gray-400">|</span>
        <span className="text-sm text-gray-500">Landing Pages Admin</span>
      </div>
      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
        Log out
      </button>
    </header>
  );
}
