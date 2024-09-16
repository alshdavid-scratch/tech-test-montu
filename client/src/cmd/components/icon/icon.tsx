import './icon.scss'
import { h } from "preact";
import { classNames } from "../../../platform/preact/class-names.ts";
import { HeartSolid } from './src/heart-solid.tsx'
import { HeartRegular } from './src/heart-regular.tsx';

export type IconProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  kind: 'heart' | 'star'
  color?: string
  variant?: 'solid' | 'regular'
}

export function Icon({kind, variant = 'solid', color, className, ...props}: IconProps) {
  const Selected = IconIndex[kind]?.[variant]

  return <div 
    {...props} 
    className={classNames('component-icon', className)}
    >{Selected && <Selected fill={color} />}</div>
}

const IconIndex: any = {
  heart: {
    solid: HeartSolid,
    regular: HeartRegular,
  }
}