"use client";

import { useState } from "react";

export function CertificateForm() {
  const [certCode, setCertCode] = useState("");

  function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    if (certCode.trim()) {
      window.open(
        `/verify-certificate?code=${encodeURIComponent(certCode.trim())}`,
        "_blank",
      );
    }
  }

  return (
    <form onSubmit={handleValidate} className="flex gap-4">
      <input
        type="text"
        value={certCode}
        onChange={(e) => setCertCode(e.target.value)}
        placeholder="Enter Certificate Code"
        className="h-10 min-w-0 flex-1 rounded-lg border border-neutral-40 bg-white px-3.5 font-open-sans text-[14px] leading-[1.5] text-neutral-200 placeholder:text-neutral-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded border border-secondary-500 bg-secondary-500 px-3 font-open-sans text-[16px] leading-[1.5] text-white transition-colors hover:bg-secondary-600"
      >
        Validate
      </button>
    </form>
  );
}
