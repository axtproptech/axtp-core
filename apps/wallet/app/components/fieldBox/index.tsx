import { Input } from "react-daisyui";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: "text" | "email" | "date";
  placeholder?: string;
  helperText?: string;
  className?: string;
  errorLabel?: string;
}

export const FieldBox = ({
  label,
  type = "text",
  placeholder,
  helperText,
  className = "",
  errorLabel,
  ...inputProps
}: Props) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-bold text-base">{label}</span>
        </label>
      )}

      {/*@ts-ignore*/}
      <Input
        {...inputProps}
        type={type}
        placeholder={placeholder}
        size="lg"
        className={`font-semibold ${className}`}
      />

      {(helperText || errorLabel) && (
        <label className="label">
          {helperText && !errorLabel && (
            <span className="label-text-alt opacity-70">{helperText}</span>
          )}

          {errorLabel && (
            <span className="label-text-alt font-bold text-red-700">
              {errorLabel}
            </span>
          )}
        </label>
      )}
    </div>
  );
};
