import { Loader2 } from "lucide-react";

const Combination = ({
  searched,
  combinations,
  selectedComboIdx,
  holdingComboIdx,
  holdingSessionId,
  setHoldingRooms,
  setHoldingComboIdx,
  setErrors,
  holdRooms,
  setSelectedComboIdx,
  setRoomItems,
  setOpenSections,
}) => {
  return (
    <>
      {searched && combinations.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-gray-600">
              Gợi ý tổ hợp phòng
            </p>
            <p className="text-xs text-gray-600">Hoặc chọn thủ công bên dưới</p>
          </div>
          <div className="flex flex-col gap-2">
            {combinations.map((combo, idx) => (
              <button
                key={idx}
                type="button"
                disabled={selectedComboIdx === idx && holdingSessionId}
                onClick={async () => {
                  if (selectedComboIdx === idx && holdingSessionId) return;
                  setHoldingRooms(true);
                  setHoldingComboIdx(idx);
                  setErrors((p) => ({ ...p, booking: undefined }));
                  try {
                    await holdRooms(combo.rooms.map((r) => r.roomId));
                    setSelectedComboIdx(idx);
                    setRoomItems(
                      combo.rooms.map((r) => ({ room: r, services: [] })),
                    );
                    setErrors((p) => {
                      const next = { ...p };
                      combo.rooms.forEach((_, i) => delete next[`room_${i}`]);
                      return next;
                    });
                    setOpenSections((p) => ({ ...p, rooms: true }));
                  } catch (err) {
                    setErrors((p) => ({
                      ...p,
                      booking:
                        err?.message ||
                        "Không thể giữ phòng. Vui lòng thử lại.",
                    }));
                  } finally {
                    setHoldingRooms(false);
                    setHoldingComboIdx(null);
                  }
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all ${selectedComboIdx === idx && holdingSessionId
                    ? "cursor-not-allowed"
                    : selectedComboIdx === idx && holdingSessionId
                      ? "cursor-default"
                      : "cursor-pointer hover:border-[rgba(176,38,255,0.25)] hover:bg-white/[0.04] opacity-60 hover:opacity-90"
                  } ${selectedComboIdx === idx && holdingSessionId
                    ? "border-[rgba(176,38,255,0.5)] bg-[rgba(176,38,255,0.08)]"
                    : "border-white/[0.06] bg-white/[0.02]"
                  }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-400">
                    {idx + 1} . {combo.rooms.length} phòng .{" "}
                    {combo.totalCapacity} người
                  </span>
                  {/* Badge: chỉ hiển thị đúng combo đang được thao tác */}
                  {holdingComboIdx === idx ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Loader2 size={9} className="animate-spin" /> Đang giữ...
                    </span>
                  ) : selectedComboIdx === idx && holdingSessionId ? (
                    <span className="text-xs font-bold text-emerald-400">
                      Đã giữ ✓
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1.5">
                  {combo.rooms.map((r) => (
                    <div
                      key={r.roomId}
                      className="flex items-center justify-between"
                    >
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
                        Phòng {r.roomNumber} - Tầng {r.floor} - Loại phòng {"("}
                        {r.roomType?.typeName}
                        {")"}
                      </span>
                      {r.roomType?.roomBeds?.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[rgba(176,38,255,0.1)] border border-[rgba(176,38,255,0.2)] text-[#dda6ff]">
                          Giường -{" "}
                          {r.roomType.roomBeds
                            .map((b) => `${b.quantity}x ${b.roomBedType}`)
                            .join(", ")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Combination;
