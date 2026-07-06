import { formatVND } from "@/types/utils/fomatters/vndFomatter";
import { Bed, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import ServiceSelect from "./ServiceSelect";
import RemoveButton from "@/components/common/RemoveButton";
import Stepper from "@/components/common/Stepper";
import RoomSelectDropdown from "./RoomSelectDropdown";
import Section from "./Section";

const RoomSelect = ({
  searched,
  availableRooms,
  onOpen,
  services,
  onToggle,
  roomItems,
  holdingRooms,
  onAddRoom,
  onRemoveRoom,
  errors,
  setErrors,
  onUpdateRoom,
  selectedRoomIds,
  nights,
  onAddService,
  onUpdateService,
  onRemoveService,
  isManualMode,
  setHoldingRooms,
  holdingSessionId,
  setSelectedComboIdx,
  holdRooms,
}) => {
  return (
    <>
      {searched && availableRooms.length > 0 && (
        <Section
          title="Phòng"
          icon={<Bed size={13} />}
          isOpen={onOpen}
          onToggle={onToggle}
        >
          <div className="flex flex-col gap-3">
            {roomItems.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-600">
                    Phòng {i + 1}
                  </p>
                  {roomItems.length > 1 && (
                    <button
                      onClick={() => onRemoveRoom(i)}
                      className="p-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>

                <RoomSelectDropdown
                  rooms={availableRooms}
                  value={item.room}
                  onChange={(room) => {
                    onUpdateRoom(i, "room", room);
                    setErrors((p) => ({ ...p, [`room_${i}`]: undefined }));
                  }}
                  disabledIds={selectedRoomIds.filter(
                    (id) => id !== item.room?.roomId,
                  )}
                  error={errors[`room_${i}`]}
                />

                {item.room && (
                  <div className="flex flex-col gap-2">
                    {/* Ảnh cover */}
                    {(() => {
                      const cover =
                        item.room.roomType?.roomImages?.find(
                          (i) => i.isCover,
                        ) ?? item.room.roomType?.roomImages?.[0];
                      return cover ? (
                        <img
                          src={cover.url}
                          alt={cover.altText ?? "Phòng"}
                          className="w-full h-28 object-cover rounded-lg"
                        />
                      ) : null;
                    })()}

                    {/* Loại giường */}
                    {item.room.roomType?.beds?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.room.roomType.beds.map((b, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-gray-400"
                          >
                            <Bed size={9} /> {b.quantity} {b.roomBedType}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Giá */}
                    {nights > 0 && (
                      <p className="text-xs text-gray-600">
                        {nights} đêm · Tổng:{" "}
                        {formatVND(
                          parseFloat(item.room.roomType?.activePrice ?? 0) *
                          nights,
                        )}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-600 flex items-center gap-1">
                      <Sparkles size={10} /> Dịch vụ
                    </p>
                    <button
                      onClick={() => onAddService(i)}
                      className="text-xs font-bold text-[#b026ff] hover:text-[#dda6ff] cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Plus size={10} /> Thêm
                    </button>
                  </div>

                  {item.services.map((svc, si) => (
                    <div key={si} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <ServiceSelect
                          services={services}
                          value={svc.serviceId}
                          onChange={(serviceId) => {
                            onUpdateService(i, si, "serviceId", serviceId);
                            setErrors((p) => ({
                              ...p,
                              [`svc_${i}_${si}`]: undefined,
                            }));
                          }}
                          error={errors[`svc_${i}_${si}`]}
                        />

                        <div className="flex items-center gap-4">
                          <Stepper
                            min={1}
                            value={svc.quantity}
                            onChange={(newVal) =>
                              onUpdateService(i, si, "quantity", newVal)
                            }
                          />
                          <div>
                            <RemoveButton
                              onRemove={() => onRemoveService(i, si)}
                            />
                          </div>
                        </div>
                      </div>
                      {errors[`svc_${i}_${si}`] && (
                        <span className="text-xs text-red-400">
                          {errors[`svc_${i}_${si}`]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={onAddRoom}
              className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-[rgba(176,38,255,0.3)] text-xs font-bold text-[#b026ff] hover:bg-[rgba(176,38,255,0.06)] transition-colors cursor-pointer"
            >
              <Plus size={13} /> Thêm phòng
            </button>

            {/* Nút xác nhận giữ phòng - hiển thị khi đang ở manual mode */}
            {isManualMode &&
              (holdingSessionId ? (
                <div className="flex items-center justify-center gap-2 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                  Đã giữ phòng ✓
                </div>
              ) : (
                <button
                  disabled={holdingRooms || roomItems.every((i) => !i.room)}
                  onClick={async () => {
                    const roomIds = roomItems
                      .map((i) => i.room?.roomId)
                      .filter(Boolean);
                    if (!roomIds.length) return;
                    setHoldingRooms(true);
                    setErrors((p) => ({ ...p, booking: undefined }));
                    try {
                      await holdRooms(roomIds);
                      setSelectedComboIdx(null);
                    } catch (err) {
                      setErrors((p) => ({
                        ...p,
                        booking:
                          err?.message ||
                          "Không thể giữ phòng. Vui lòng thử lại.",
                      }));
                    } finally {
                      setHoldingRooms(false);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold transition-all ${holdingRooms || roomItems.every((i) => !i.room)
                      ? "bg-white/[0.04] border border-white/[0.06] text-gray-600 cursor-not-allowed"
                      : "border border-[rgba(176,38,255,0.4)] bg-[rgba(176,38,255,0.08)] text-[#b026ff] hover:bg-[rgba(176,38,255,0.15)] cursor-pointer animate-pulse hover:animate-none"
                    }`}
                >
                  {holdingRooms ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : null}
                  {holdingRooms ? "Đang giữ phòng..." : "Xác nhận giữ phòng"}
                </button>
              ))}
          </div>
        </Section>
      )}
    </>
  );
};

export default RoomSelect;
