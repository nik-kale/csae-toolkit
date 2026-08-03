// Shared button used across the side panel. Defaults to type="button" so a
// button inside any future <form> never submits it by accident.
const VARIANTS = {
  primary: 'bg-[#649ef5] hover:bg-[#44696d]',
  danger: 'bg-[#44696d] hover:bg-red-600',
  neutral: 'bg-[#3a4750] hover:bg-[#556069]',
};

const Button = ({ variant = 'primary', className = '', type = 'button', children, ...rest }) => {
  const base =
    'px-4 py-2 w-full text-white rounded transition duration-300 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed';
  return (
    <button
      type={type}
      className={`${base} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
