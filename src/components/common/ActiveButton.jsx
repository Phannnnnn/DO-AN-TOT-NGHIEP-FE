const ActiveButton = ({ isActive = false, label = "Trạng thái", onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div>
        <p className="text-xs font-semibold text-gray-200">{label}</p>
        <p
          className={`text-xs mt-0.5 ${isActive ? "text-[var(--green)]" : "text-[var(--white)]/60"}`}
        >
          {isActive ? "Kích hoạt" : "Vô hiệu hóa"}
        </p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
          isActive ? "bg-emerald-500" : "bg-gray-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ActiveButton;
