"use client";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <button className="relative">
          🔔
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            U
          </div>

          <div>
            <p className="font-medium">
              Umair Khan
            </p>
            <p className="text-sm text-gray-500">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}