import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const Stepper = ({ label, value, onChange, min = 0 }) => {
  const [inputVal, setInputVal] = useState(String(value));

  // Sync khi value thay đổi từ bên ngoài
  useEffect(() => {
    setInputVal(String(value));
  }, [value]);

  // Xử lý khi người dùng đang gõ
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val); // Cập nhật state nội bộ để thấy số đang gõ ngay lập tức

    // Cập nhật lên parent ngay nếu nó là số hợp lệ (bỏ qua chuỗi rỗng)
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
    }
  };

  // Xử lý khi người dùng click ra ngoài (Blur)
  const handleBlur = () => {
    const parsed = parseInt(inputVal, 10);

    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
      setInputVal(String(parsed)); // Xóa các số 0 vô nghĩa ở đầu (ví dụ: "05" -> "5")
    } else {
      // Nếu nhập bậy (xóa trắng, nhập chữ, hoặc < min), tự động reset về giá trị hợp lệ
      const fallback = Math.max(min, value);
      onChange(fallback);
      setInputVal(String(fallback));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
  };

  const decrement = () => {
    const next = Math.max(min, value - 1);
    onChange(next);
    setInputVal(String(next));
  };

  const increment = () => {
    const next = value + 1;
    onChange(next);
    setInputVal(String(next));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.12em]">
          {label}
        </label>
      )}
      <div className="flex items-center h-11 rounded-lg border border-[rgba(176,38,255,0.15)] bg-white/[0.04]">
        {/* Decrement */}
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={`w-11 h-full flex items-center justify-center border-r border-[rgba(176,38,255,0.1)] transition-colors shrink-0 rounded-l-lg
            ${
              value <= min
                ? "text-white/10 cursor-not-allowed"
                : "text-[#c77dff] hover:bg-[rgba(176,38,255,0.1)] cursor-pointer"
            }`}
        >
          <Minus size={13} />
        </button>

        {/* Input */}
        <input
          type="number"
          value={inputVal}
          onChange={handleInputChange} // Đã thay đổi ở đây
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="
            flex-1 h-full w-12 text-center text-[15px] font-black text-gray-200
            bg-transparent outline-none border-none
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
        />

        {/* Increment */}
        <button
          type="button"
          onClick={increment}
          className="w-11 h-full flex items-center justify-center border-l border-[rgba(176,38,255,0.1)] text-[#c77dff] hover:bg-[rgba(176,38,255,0.1)] transition-colors cursor-pointer shrink-0 rounded-r-lg"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
};

export default Stepper;
