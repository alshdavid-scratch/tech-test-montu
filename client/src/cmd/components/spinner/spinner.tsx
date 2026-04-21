import "./spinner.scss";
import { h, type ComponentProps } from "preact";

export type SpinnerProps = ComponentProps<"div"> & {};

export function Spinner({ children, ...props }: SpinnerProps) {
  return (
    <div className="component-spinner" {...props}>
      <div className="loader"></div>
      {children && <div className="text">{children}</div>}
    </div>
  );
}
