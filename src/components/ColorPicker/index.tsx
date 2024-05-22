import { useMemo, useRef, useState } from "react";
import './style.scss';

const colors: { value: string }[] = [
  {
    value: 'var(--ccm-chart-N700)',
  },
  {
    value: 'var(--ccm-chart-B500)',
  },
  {
    value: 'var(--ccm-chart-I500)',
  },
  {
    value: 'var(--ccm-chart-G500)'
  },
  {
    value: 'var(--ccm-chart-W500)'
  },
  {
    value: 'var(--ccm-chart-Y500)'
  },
  {
    value: 'var(--ccm-chart-O500)'
  },
  {
    value: 'var(--ccm-chart-R400)'
  },
]

export function ColorPicker(props: { onChange: (color: string) => void, value: string }) {


  return <div className="color-picker">
    {colors.map(({ value }) => <div
      onClick={() => { props.onChange(value) }}
      key={value}
      style={{
        borderColor: props.value === value ? value : 'transparent'
      }}
      className="color-picker-color-container">
      <div style={{
        backgroundColor: value
      }} className="color-picker-color">

        {props.value === value ? <div className="selected-icon-container"></div> : null}

      </div>

    </div>)}
  </div>

}