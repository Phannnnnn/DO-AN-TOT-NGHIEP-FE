const BookingTable = () => {
  const bookings = [
    {
      id: 1,
      room: "P.201",
      guest: "Nguyễn Văn A",
      checkIn: "14:00 - 24/10",
      checkOut: "12:00 - 26/10",
      status: "check-in",
    },
    {
      id: 2,
      room: "P.105",
      guest: "Lê Thị Mai",
      checkIn: "15:30 - 24/10",
      checkOut: "12:00 - 25/10",
      status: "pending",
    },
    {
      id: 3,
      room: "P.302",
      guest: "Trần Hoàng Nam",
      checkIn: "14:00 - 24/10",
      checkOut: "12:00 - 28/10",
      status: "check-in",
    },
    {
      id: 4,
      room: "P.404",
      guest: "Phạm Minh Tuấn",
      checkIn: "17:00 - 24/10",
      checkOut: "12:00 - 25/10",
      status: "late-checkout",
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      "check-in": {
        bg: "bg-[#75D09A]",
        text: "text-[#006A4E]",
        label: "Đã check-in",
      },
      pending: {
        bg: "bg-[#9FB9E2]",
        text: "text-[#005477]",
        label: "Chờ nhận phòng",
      },
      "late-checkout": {
        bg: "bg-[#F3E5AB]",
        text: "text-[#F2C83F]",
        label: "Cần dọn",
      },
    };
    return statusMap[status] || statusMap["pending"];
  };

  return (
    <div className="bg-[var(--white)] rounded-lg p-6 shadow-sm border border-[var(--black)]/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--black)]">
          Booking hôm nay
        </h3>
        <a
          href="#"
          className="text-[var(--blue)] hover:text-[var(--blue_dark)] text-sm font-medium"
        >
          Xem tất cả
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--black)]/20">
              <th className="text-left py-3 uppercase px-2 font-semibold">
                PHÒNG
              </th>
              <th className="text-left py-3 uppercase px-2 font-semibold">
                KHÁCH HÀNG
              </th>
              <th className="text-left py-3 uppercase px-2 font-semibold">
                CHECK-IN
              </th>
              <th className="text-left py-3 uppercase px-2 font-semibold">
                CHECK-OUT
              </th>
              <th className="text-left py-3 uppercase px-2 font-semibold">
                TRẠNG THÁI
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              return (
                <tr
                  key={booking.id}
                  className="border-b border-[var(--black)]/20 hover:bg-[var(--black)]/5 transition-colors duration-200"
                >
                  <td className="py-3 px-2 font-medium">{booking.room}</td>
                  <td className="py-3 px-2 font-medium text-[var(--black)]/60">
                    {booking.guest}
                  </td>
                  <td className="py-3 px-2 font-medium">{booking.checkIn}</td>
                  <td className="py-3 px-2 font-medium text-[var(--black)]/60">
                    {booking.checkOut}
                  </td>
                  <td className="py-3 px-2 font-medium">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.label}
                    </span>
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

export default BookingTable;
