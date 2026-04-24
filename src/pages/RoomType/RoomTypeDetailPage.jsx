import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  BedDouble,
  Tag,
  DollarSign,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";

import { roomTypeService } from "@/services/rooms/roomTypeService";

import TabAmenities from "./Tabs/TabAmenities";
import TabBeds from "./Tabs/TabBeds";
import TabInfo from "./Tabs/TabInfo";
import TabPricePlans from "./Tabs/TabPricePlans";
import { roomBedService } from "@/services/roombeds/roomBedService";
import { roomAmenityService } from "@/services/roomAmenity/roomAmenityService";
import { roomTypeAmenityService } from "@/services/roomTypeAmenity/roomTypeAmenityService";
import { pricePlanService } from "@/services/pricePlans/pricePlanService";

const TABS = [
  { key: "info", label: "Thông tin", icon: Info },
  { key: "beds", label: "Giường", icon: BedDouble },
  { key: "amenities", label: "Tiện nghi", icon: Tag },
  { key: "prices", label: "Bảng giá", icon: DollarSign },
];

// ─────────────────────────────────────────────────────────────
const RoomTypeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState(null);
  const [beds, setBeds] = useState([]);
  const [amenities, setAmenities] = useState([]); // all amenities (master)
  const [linked, setLinked] = useState([]); // roomTypeAmenities for this type
  const [pricePlans, setPricePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rtRes, bedRes, allAmenRes, linkedRes, planRes] = await Promise.all(
        [
          roomTypeService.roomTypeById(id),
          roomBedService.getByRoomTypeId(id),
          roomAmenityService.roomAmenities(),
          roomTypeAmenityService.roomTypeAmenityByRoomTypeId(id),
          pricePlanService.pricePlansByRoomTypeId(id),
        ],
      );

      if (rtRes.success) setRoomType(rtRes.data);
      if (bedRes.success) setBeds(bedRes.data || []);
      if (allAmenRes.success) setAmenities(allAmenRes.data || []);
      if (linkedRes.success) setLinked(linkedRes.data || []);
      if (planRes.success) setPricePlans(planRes.data || []);
    } catch (e) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  if (loading)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "#0f0a19" }}
      >
        <Loader2
          className="animate-spin"
          size={32}
          style={{ color: "#b026ff" }}
        />
      </div>
    );

  if (!roomType)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "#0f0a19" }}
      >
        <p className="text-xs font-black text-[var(--white)]/60 uppercase tracking-widest">
          Không tìm thấy loại phòng
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-[#0f0a19]">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3.5 py-2 cursor-pointer rounded-xl text-[11px] font-black uppercase tracking-wider text-[var(--white)]/60 border border-[var(--white)]/[0.08] bg-[var(--white)]/[0.03] hover:bg-[var(--white)]/[0.07] hover:text-gray-400 transition-all"
        >
          <ArrowLeft size={13} /> Quay lại
        </button>

        <div className="flex-1">
          <h1 className="text-2xl font-black text-[var(--white)] capitalize tracking-tight">
            {roomType.typeName}
            <span className="ml-3 text-xs font-black text-[var(--white)]/60 normal-case tracking-widest">
              #{roomType.roomTypeId}
            </span>
          </h1>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3">
          {[
            { label: "Giường", value: beds.length },
            { label: "Tiện nghi", value: linked.length },
            { label: "Bảng giá", value: pricePlans.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025]"
            >
              <span className="text-lg font-black text-[#dda6ff]">{value}</span>
              <span className="text-[9px] font-black text-[var(--white)]/60 uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all
                ${
                  isActive
                    ? "bg-[var(--high-purple)]/30 text-[var(--white)] border border-[var(--high-purple)]/60 shadow-[0_0_20px_rgba(176,38,255,0.2)]"
                    : "text-[var(--white)]/60 hover:text-[var(--white)] hover:bg-[var(--high-purple)]/30 border border-transparent cursor-pointer"
                }`}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "info" && (
          <TabInfo
            roomType={roomType}
            onUpdate={async (data) => {
              const res = await roomTypeService.update(id, data);
              if (res?.success) {
                setRoomType(res.data);
                toast.success("Cập nhật thành công.");
              }
            }}
          />
        )}
        {activeTab === "beds" && (
          <TabBeds beds={beds} roomTypeId={Number(id)} onChange={setBeds} />
        )}
        {activeTab === "amenities" && (
          <TabAmenities
            allAmenities={amenities}
            linked={linked}
            roomTypeId={Number(id)}
            onChange={setLinked}
          />
        )}
        {activeTab === "prices" && (
          <TabPricePlans
            pricePlans={pricePlans}
            roomTypeId={Number(id)}
            onChange={setPricePlans}
          />
        )}
      </div>
    </div>
  );
};

export default RoomTypeDetailPage;
