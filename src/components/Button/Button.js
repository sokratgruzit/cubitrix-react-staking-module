import './Button.css';

const Button = props => {
    return (
    <button
      className={`${props.className}`}
      style={props.customStyles}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};

export default Button;
