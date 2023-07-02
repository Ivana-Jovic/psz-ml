import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <div className={`form-control ${className}`}>
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <input ref={ref} className={`input w-full input-bordered`} {...rest} />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
