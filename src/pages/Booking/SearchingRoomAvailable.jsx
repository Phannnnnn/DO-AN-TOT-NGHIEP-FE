import { Loader2, Search } from "lucide-react";

const SearchingRoomAvailable = ({
  onSearch,
  disabled,
  searching,
  searched,
  availableRooms,
  combinations,
  errors,
  successMessage,
  errorSearched,
}) => {
  return (
    <div>
      <button
        onClick={onSearch}
        disabled={disabled || searching}
        className={`w-full h-10 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
          disabled
            ? "bg-white/[0.04] border border-white/[0.06] text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-br from-[#b026ff] to-[#7c3aed] text-white shadow-[0_4px_16px_rgba(176,38,255,0.3)] hover:shadow-[0_6px_20px_rgba(176,38,255,0.45)] cursor-pointer"
        }`}
      >
        {searching ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Search size={13} />
        )}
        {searching ? "Đang tìm..." : "Tìm phòng phù hợp"}
      </button>

      {searched && (
        <p className="text-xs text-center font-semibold">
          {availableRooms.length === 0 ? (
            <span className="text-red-400">
              Không có phòng trống trong khoảng thời gian này
            </span>
          ) : combinations.length > 0 ? (
            <span className="text-emerald-400">
              Tìm thấy {combinations.length} gợi ý. {availableRooms.length}{" "}
              phòng trống
            </span>
          ) : (
            <span className="text-amber-400">
              Không có phòng đơn lẻ đủ sức chứa .{" Tìm thấy "}
              {availableRooms.length} phòng trống.
            </span>
          )}
        </p>
      )}

      {errors.booking && (
        <div className="text-center text-xs text-red-400 font-semibold">
          {errors.booking}
        </div>
      )}

      {successMessage && (
        <div className="text-center text-xs text-emerald-400 font-semibold">
          {successMessage}
        </div>
      )}

      {errorSearched && (
        <p className="text-xs text-center font-semibold">
          <span className="text-red-400">{errorSearched}</span>
        </p>
      )}
    </div>
  );
};

export default SearchingRoomAvailable;
