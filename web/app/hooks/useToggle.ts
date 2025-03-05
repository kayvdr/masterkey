import { useState } from "react";

const useToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    close: () => setIsOpen(false),
    open: () => setIsOpen(true),
    toggle: () => setIsOpen(!isOpen),
  };
};

export default useToggle;
