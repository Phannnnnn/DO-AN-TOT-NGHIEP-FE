const InputFormArea = ({
 label = "Mô tả",
 value,
 onChange,
 placeholder = "Mô tả",
}) => {
 return (
 <div className="flex flex-col gap-1.5">
 <label className="text-xs font-bold text-gray-600">
 {label}
 </label>
 <textarea
 value={value}
 onChange={onChange}
 placeholder={placeholder}
 rows={3}
 className="px-3.5 py-2.5 rounded-lg bg-white/[0.04] text-sm font-semibold text-gray-200 outline-none transition-all border border-[rgba(176,38,255,0.15)] focus:border-[rgba(176,38,255,0.5)] resize-none"
 />
 </div>
 );
};

export default InputFormArea;
