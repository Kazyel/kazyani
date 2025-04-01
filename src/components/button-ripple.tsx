import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface ButtonCircleProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonRipple = ({ children, className, disabled, onClick }: ButtonCircleProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;

    const handleCircleExpand = (event: MouseEvent) => {
      const circle = document.createElement("span");
      circle.classList.add("ripple-circle");

      const rect = button!.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      button!.appendChild(circle);

      circle.addEventListener("animationend", () => {
        circle.remove();
      });
    };

    button?.addEventListener("mousedown", (event) => handleCircleExpand(event as MouseEvent));

    return () =>
      button?.removeEventListener("mousedown", (event) => handleCircleExpand(event as MouseEvent));
  }, []);

  return (
    <Button
      className={`ripple-button relative overflow-hidden transition-all duration-150 ease ${className}`}
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
