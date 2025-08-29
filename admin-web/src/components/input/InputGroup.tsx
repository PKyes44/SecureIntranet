import { useId, type PropsWithChildren } from "react";
import type { InputProps } from "./input";
import Input from "./input";

type inputGroupProps = {
  label?: string;
  wrapperClassName?: string;
  innerClassName?: string;
  inputClassName?: string;
  errorText?: string | null;
  helpText?: string | null;
};
type InputGroupProps = inputGroupProps & Omit<InputProps, "inputId">;

function InputGroup({
  errorText,
  helpText,
  label,
  wrapperClassName,
  innerClassName,
  inputClassName,
  children,
  ...props
}: PropsWithChildren<InputGroupProps>) {
  const inputId = useId();

  return (
    <div className={`w-66 flex flex-col gap-y-1 ${wrapperClassName}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      {children ? (
        <div className={`${wrapperClassName}`}>
          {children}
          <Input
            intent={errorText ? "error" : "default"}
            innerClassName={innerClassName}
            inputClassName={inputClassName}
            inputId={inputId}
            {...props}
          />
        </div>
      ) : (
        <Input
          intent={errorText ? "error" : "default"}
          innerClassName={innerClassName}
          inputClassName={inputClassName}
          inputId={inputId}
          {...props}
        />
      )}
      {errorText ? (
        <span className="text-red-500 text-sm sm:text-[10px] sm:leading-3">
          {errorText}
        </span>
      ) : (
        helpText && (
          <span className="text-gray-400 text-sm sm:text-xs">{helpText}</span>
        )
      )}
    </div>
  );
}

export default InputGroup;