const InputFormValidator = ({ label, value, placeholder, onChange, error }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-600">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-11 px-3.5 rounded-lg bg-white/[0.04] text-sm font-semibold text-gray-200 outline-none transition-all border ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)]"
        }`}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default InputFormValidator;
