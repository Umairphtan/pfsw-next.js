"use client";

import type { ReactNode } from "react";

interface CategoryModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function CategoryModal({ title, children, onClose }: CategoryModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose} // background click se close
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // form ke andar click se close na ho
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}