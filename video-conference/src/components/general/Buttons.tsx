import React from "react";
import classNames from "classnames";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className: string;
  type?: "submit" | "button" | "reset";
}

export const Buttons: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  type = "submit",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(
        "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-3 px-4 border border-blue-500 hover:border-transparent rounded",
        className
      )}
    >
      {children}
    </button>
  );
};
