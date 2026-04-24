import { AlertCircle } from "lucide-react";

const RoomCleaningTable = () => {
  const rooms = [
    {
      id: 1,
      room: "P.210",
      floor: "Tầng 2",
      status: "urgent",
      time: "10:45 AM (Quá hạn)",
    },
    {
      id: 2,
      room: "P.102",
      floor: "Tầng 1",
      status: "pending",
      time: "11:15 AM",
    },
    {
      id: 3,
      room: "P.501",
      floor: "Tầng 5",
      status: "pending",
      time: "12:00 PM",
    },
    {
      id: 4,
      room: "P.305",
      floor: "Tầng 3",
      status: "pending",
      time: "12:30 PM",
    },
  ];

  const getStatusColor = (status) => {
    const colorMap = {
      urgent: {
        bg: "bg-red-100",
        text: "text-[#B62625]",
        icon: true,
      },
      pending: {
        bg: "bg-[#F3E5AB]",
        text: "text-[#F2C83F]",
        icon: false,
      },
    };
    return colorMap[status] || colorMap["pending"];
  };

  return (
    <div className="bg-[var(--white)] rounded-lg p-6 shadow-sm border border-[var(--black)]/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibol">Phòng cần dọn</h3>
        {/* <button className="text-[var(--blue)] hover:text-[var(--blue_dark)] font-medium">
          <span className="text-sm">Chi tiết</span>
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--black)]/20">
              <th className="text-left py-3 px-2 font-semibold ">SỐ PHÒNG</th>
              <th className="text-left py-3 px-2 font-semibold">TẦNG</th>
              <th className="text-left py-3 px-2 font-semibold">CHECK-OUT</th>
              <th className="text-left py-3 px-2 font-semibold">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const statusColor = getStatusColor(room.status);
              return (
                <tr
                  key={room.id}
                  className="border-b border-[var(--black)]/20 hover:bg-[var(--black)]/5 transition-colors duration-200"
                >
                  <td className="py-3 px-2 font-medium ">{room.room}</td>
                  <td className="py-3 px-2 font-medium text-[var(--black)]/60">
                    {room.floor}
                  </td>
                  <td className="py-3 px-2 font-medium ">{room.time}</td>
                  <td className="py-3 px-2 font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                      >
                        {room.status === "urgent" ? "Cần dọn gấp" : "Đang dọn"}
                      </span>
                      {statusColor.icon && (
                        <AlertCircle className="w-4 h-4 text-[var(--red)]" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomCleaningTable;
