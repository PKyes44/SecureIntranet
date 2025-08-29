import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, PropsWithChildren } from "react";

const buttonVariant = cva("", {
  variants: {
    outline: {
      true: "border border-black",
      false: "border-none",
    },
    size: {
      xs: "py-1.5 px-10",
      sm: "px-14 py-1.5",
      md: "px-28 py-2.5",
    },
    intent: {
      default: "bg-black",
      primary: "bg-yellow-300",
      none: "bg-none",
      disabled: "bg-[#dddddd] bg-opacity-80",
      red: "bg-red-200 bg-opacity-80 ",
      green: "bg-green-200 bg-opacity-80",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
    },
    textIntent: {
      default: "text-white",
      black: "text-black",
      primary: "text-yellow-400",
      red: "text-red-400",
      disabled: " text-[#999999]",
      green: "text-green-400",
    },
  },
  compoundVariants: [
    { intent: "default", className: "text-white" },
    { size: "sm", className: "text-sm" },
    { size: "xs", className: "text-xs" },
    {
      size: "md",
      className: "text-base",
    },
    {
      textIntent: "primary",
      intent: "primary",
      className: "bg-opacity-40 font-bold",
    },
    {
      textIntent: "red",
      intent: "red",
      className: "bg-opacity-40 font-bold",
    },
    {
      textIntent: "disabled",
      intent: "disabled",
      className: "bg-opacity-40 font-bold",
    },
    {
      intent: "green",
      textIntent: "green",
      className: "bg-opacity-40 font-bold",
    },
    { outline: true, className: "bg-opacity-5" },
    { outline: true, textIntent: "default", className: "!text-black" },
  ],
  defaultVariants: {
    outline: false,
    intent: "default",
    size: "sm",
    rounded: "sm",
    textIntent: "default",
  },
});

export type ButtonVariant = VariantProps<typeof buttonVariant>;
type buttonProps = {
  className?: string;
};
export type ButtonProps = ButtonVariant &
  PropsWithChildren<buttonProps> &
  ComponentProps<"button">;

function Button({
  size,
  intent,
  outline,
  textIntent,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariant({
        outline,
        size,
        intent,
        textIntent,
        className,
      })}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;