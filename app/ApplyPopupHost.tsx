"use client";

import { useEffect, useState } from "react";
import ApplyPopup from "./ApplyPopup";

export const OPEN_APPLICATION_POPUP = "open-rpians-application-popup";

export default function ApplyPopupHost() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openPopup = () => {
      setIsOpen(true);
    };

    window.addEventListener(OPEN_APPLICATION_POPUP, openPopup);

    return () => {
      window.removeEventListener(OPEN_APPLICATION_POPUP, openPopup);
    };
  }, []);

  return (
    <ApplyPopup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}