import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const inputVariant = cva("border text-white", {
  variants: {
    size: {
      xs: "py-2.5 px-4",
      sm: "px-7 py-1.5",
      md: "px-11 py-2.5",
      lg: "px-20 py-3"
    },
    intent: {
      error: "border-red-500",
      default: "border-[#8C8C8C]",
    },
    rounded: {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
    },
    fontSize: {
      sm: "text-sm",
      xs: "text-xs",
      base: "text-base",
      md: "text-md",
      lg: "text-lg",
    }
  },
  compoundVariants: [],
  defaultVariants: {
    intent: "default",
    rounded: "sm",
    size: "xs",
    fontSize: "sm"
  },
});

type InputVariant = VariantProps<typeof inputVariant>;
type inputProps = {
  inputId: string;
  innerClassName?: string;
  inputClassName?: string;
};
export type InputProps = ComponentProps<"input"> & InputVariant & inputProps;

function Input({
  inputId,
  intent,
  rounded,
  innerClassName,
  inputClassName,
  ...props
}: InputProps) {
  return (
    <div
      className={inputVariant({
        intent,
        rounded,
        className: innerClassName,
      })}
    >
      <input
        id={inputId}
        className={`${inputClassName} w-full outline-none bg-transparent`}
        {...props}
      />
    </div>
  );
}

export default Input;