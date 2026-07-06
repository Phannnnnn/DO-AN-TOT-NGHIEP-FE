const SubmitButton = ({ disabled, title, className }) => {
  return <button
    type="submit"
    disabled={disabled}
    className={`${disabled
      ? "opacity-60 cursor-not-allowed"
      : "hover:shadow-[0_0_25px_rgba(176,38,255,0.5),0_0_40px_rgba(0,240,255,0.3)] hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
      } w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 bg-gradient-to-r from-[#7c3aed] to-[#00f0ff] ${className}`}
  >
    {title}
  </button>
}

export default SubmitButton;
