import './input.scss'
import { h } from "preact";
import { classNames } from "../../../platform/preact/class-names.ts";

export type InputProps = h.JSX.HTMLAttributes<HTMLInputElement> & {
  onEnter?: (ev: KeyboardEvent) => any | Promise<any>
}

export function Input({ className, onEnter, ...props}: InputProps) {
  function onKeyPress(ev: KeyboardEvent) {
    if(onEnter && ev.key === 'Enter'){
      onEnter(ev)
    }
  }

  return <input 
    {...props} 
    onKeyPress={onKeyPress} 
    className={classNames("component-input", className)} />
}