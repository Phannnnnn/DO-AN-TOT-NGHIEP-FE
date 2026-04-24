import AddButton from "@/components/common/AddButton";
import SearchPrimary from "@/components/common/SearchPrimary";

const RoomTypeHeader = ({ searchQuery, setSearchQuery, onAdd }) => {
  return (
    <div
      className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 rounded-2xl"
      style={{
        background: "rgba(15,10,25,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(176,38,255,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <SearchPrimary
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={"Tìm loại phòng..."}
      />

      <AddButton onAddItem={onAdd} addLabel="Thêm loại phòng" />
    </div>
  );
};

export default RoomTypeHeader;
