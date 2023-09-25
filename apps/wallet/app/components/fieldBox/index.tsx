import { Input } from "react-daisyui";

interface Props {
  label?: string;
  type?: "text" | "email";
  placeholder?: string;
  helperText?: string;
  className?: string;
  errorLabel?: string;
  field: any;
}

export const FieldBox = ({
  label,
  type = "text",
  placeholder,
  helperText,
  className = "",
  errorLabel,
  field,
}: Props) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-bold text-base">{label}</span>
        </label>
      )}

      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        size="lg"
        className={`font-semibold ${className}`}
      />

      {(helperText || errorLabel) && (
        <label className="label">
          {helperText && !errorLabel && (
            <span className="label-text-alt font-bold text-white">
              {helperText}
            </span>
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
