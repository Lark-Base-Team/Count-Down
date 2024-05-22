import './style.scss';

export function Item(props: {
  label?: JSX.Element | string;
  children?: JSX.Element;
}) {

  if (!props.children && !props.label) {
    return null
  }

  return <div className='form-item'>
    {props.label ? <div className='label'>{props.label}</div> : null}
    {props.children ? <div>{props.children}</div> : null}
  </div>
}