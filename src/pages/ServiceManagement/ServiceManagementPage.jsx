import { useEffect, useState, useMemo } from "react";
import { Loader2, Sparkles, Tag } from "lucide-react";
import { toast } from "react-toastify";

import ServiceTable from "./ServiceTable";
import ServiceFormModal from "./ServiceFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import AddButton from "@/components/common/AddButton";
import SearchPrimary from "@/components/common/SearchPrimary";
import SelectField from "@/components/common/SelectField";
import { service_room_typeService, service_roomService } from "@/services";
import ServiceTypeTable from "./ServiceTypeTable ";
import ServiceTypeFormModal from "./ServiceTypeFormModal ";

const TABS = [
  { key: "services", label: "Dịch vụ", icon: Sparkles },
  { key: "serviceTypes", label: "Loại dịch vụ", icon: Tag },
];

const ServiceManagementPage = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");

  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [serviceTypes, setServiceTypes] = useState([]); // dùng cho dropdown filter và form
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [confirmServiceOpen, setConfirmServiceOpen] = useState(false);

  // Service Types state
  const [serviceTypesList, setServiceTypesList] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [confirmTypeOpen, setConfirmTypeOpen] = useState(false);

  // ── Fetch ────────────────────────────────────────────────
  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await service_roomService.services();
      if (res.success) setServices(res.data || []);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    setTypesLoading(true);
    try {
      const res = await service_room_typeService.serviceTypes();
      if (res.success) {
        setServiceTypesList(res.data || []);
        setServiceTypes(res.data || []);
      }
    } finally {
      setTypesLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setTypeFilter("all");
  }, [activeTab]);

  // ── Service Submit ─────────────────────────────────────
  const handleServiceSubmit = async (data) => {
    try {
      let res;
      if (selectedService?.serviceId) {
        res = await service_roomService.update(selectedService.serviceId, data);
        if (res.success) {
          setServices((prev) =>
            prev.map((s) =>
              s.serviceId === selectedService.serviceId ? res.data : s,
            ),
          );
          toast.success("Cập nhật dịch vụ thành công.");
          setIsServiceFormOpen(false);
          setSelectedService(null);
        } else {
          toast.error(extractError(res));
        }
      } else {
        res = await service_roomService.create(data);
        if (res.success) {
          setServices((prev) => [...prev, res.data]);
          toast.success("Thêm dịch vụ thành công.");
          setIsServiceFormOpen(false);
          setSelectedService(null);
        } else {
          toast.error(extractError(res));
        }
      }
    } catch (error) {
      toast.error(extractError(error));
    }
  };

  // ── Type Submit ────────────────────────────────────────
  const handleTypeSubmit = async (data) => {
    try {
      let res;
      if (selectedType?.serviceTypeId) {
        res = await service_room_typeService.update(
          selectedType.serviceTypeId,
          data,
        );
        if (res.success) {
          setServiceTypesList((prev) =>
            prev.map((t) =>
              t.serviceTypeId === selectedType.serviceTypeId ? res.data : t,
            ),
          );
          setServiceTypes((prev) =>
            prev.map((t) =>
              t.serviceTypeId === selectedType.serviceTypeId ? res.data : t,
            ),
          );
          toast.success("Cập nhật loại dịch vụ thành công.");
          setIsTypeFormOpen(false);
          setSelectedType(null);
        } else {
          toast.error(extractError(res));
        }
      } else {
        res = await service_room_typeService.create(data);
        if (res.success) {
          setServiceTypesList((prev) => [...prev, res.data]);
          setServiceTypes((prev) => [...prev, res.data]);
          toast.success("Thêm loại dịch vụ thành công.");
          setIsTypeFormOpen(false);
          setSelectedType(null);
        } else {
          toast.error(extractError(res));
        }
      }
    } catch (error) {
      toast.error(extractError(error));
    }
  };

  // ── Delete handlers ────────────────────────────────────
  const handleServiceDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    try {
      const res = await service_roomService.remove(serviceToDelete.serviceId);
      if (res.success) {
        setServices((prev) =>
          prev.filter((s) => s.serviceId !== serviceToDelete.serviceId),
        );
        toast.success("Xóa dịch vụ thành công.");
      } else {
        toast.error(extractError(res));
      }
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setServiceToDelete(null);
      setConfirmServiceOpen(false);
    }
  };

  const handleTypeDeleteConfirm = async () => {
    if (!typeToDelete) return;
    try {
      const res = await service_room_typeService.remove(
        typeToDelete.serviceTypeId,
      );
      if (res.success) {
        setServiceTypesList((prev) =>
          prev.filter((t) => t.serviceTypeId !== typeToDelete.serviceTypeId),
        );
        setServiceTypes((prev) =>
          prev.filter((t) => t.serviceTypeId !== typeToDelete.serviceTypeId),
        );
        toast.success("Xóa loại dịch vụ thành công.");
      } else {
        toast.error(extractError(res));
      }
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setTypeToDelete(null);
      setConfirmTypeOpen(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────
  const filteredServices = useMemo(
    () =>
      services.filter((svc) => {
        const matchType =
          typeFilter === "all" || String(svc.serviceTypeId) === typeFilter;
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          svc.serviceName?.toLowerCase().includes(q) ||
          svc.description?.toLowerCase().includes(q);
        return matchType && matchSearch;
      }),
    [services, searchQuery, typeFilter],
  );

  const filteredTypes = useMemo(
    () =>
      serviceTypesList.filter((type) =>
        type.typeName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [serviceTypesList, searchQuery],
  );

  // ── Helper ────────────────────────────────────────────────
  const extractError = (err) =>
    Array.isArray(err?.message)
      ? err.message.map((e) => e.error).join(", ")
      : (err?.message ?? "Có lỗi xảy ra");

  const isLoading = activeTab === "services" ? servicesLoading : typesLoading;

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0f0a19]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 bg-[#0d0d1a]/85 backdrop-blur-[12px] px-5 py-4 rounded-[0.875rem] border border-violet-500/12 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <SearchPrimary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={
              activeTab === "services"
                ? "Tìm tên dịch vụ..."
                : "Tìm loại dịch vụ..."
            }
          />

          <div className="flex gap-1.5">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-[5px] rounded-[6px] text-[10px] font-black tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border ${
                  activeTab === key
                    ? "bg-violet-500/25 text-violet-300 border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                    : "bg-white/[0.04] text-gray-500 border-white/[0.06] hover:bg-white/[0.07] hover:text-gray-400"
                }`}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>

          {activeTab === "services" && (
            <SelectField
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: "all", label: "Tất cả loại" },
                ...serviceTypes.map((type) => ({
                  value: String(type.serviceTypeId),
                  label: type.typeName,
                })),
              ]}
            />
          )}
        </div>

        <AddButton
          onAddItem={() => {
            if (activeTab === "services") {
              setSelectedService(null);
              setIsServiceFormOpen(true);
            } else {
              setSelectedType(null);
              setIsTypeFormOpen(true);
            }
          }}
          addLabel={
            activeTab === "services" ? "Thêm dịch vụ" : "Thêm loại dịch vụ"
          }
        />
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#b026ff]" size={32} />
          </div>
        ) : activeTab === "services" ? (
          <ServiceTable
            services={filteredServices}
            serviceTypes={serviceTypes}
            onEdit={(service) => {
              setSelectedService(service);
              setIsServiceFormOpen(true);
            }}
            onDelete={(service) => {
              setServiceToDelete(service);
              setConfirmServiceOpen(true);
            }}
          />
        ) : (
          <ServiceTypeTable
            types={filteredTypes}
            onEdit={(type) => {
              setSelectedType(type);
              setIsTypeFormOpen(true);
            }}
            onDelete={(type) => {
              setTypeToDelete(type);
              setConfirmTypeOpen(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <ServiceFormModal
        isOpen={isServiceFormOpen}
        initialData={selectedService}
        serviceTypes={serviceTypes}
        onClose={() => {
          setIsServiceFormOpen(false);
          setSelectedService(null);
        }}
        onSubmit={handleServiceSubmit}
      />

      <ServiceTypeFormModal
        isOpen={isTypeFormOpen}
        initialData={selectedType}
        onClose={() => {
          setIsTypeFormOpen(false);
          setSelectedType(null);
        }}
        onSubmit={handleTypeSubmit}
      />

      <ConfirmDialog
        isOpen={confirmServiceOpen}
        onClose={() => {
          setConfirmServiceOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleServiceDeleteConfirm}
        title={`Xóa dịch vụ "${serviceToDelete?.serviceName ?? ""}"?`}
        description="Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
      />

      <ConfirmDialog
        isOpen={confirmTypeOpen}
        onClose={() => {
          setConfirmTypeOpen(false);
          setTypeToDelete(null);
        }}
        onConfirm={handleTypeDeleteConfirm}
        title={`Xóa loại dịch vụ "${typeToDelete?.typeName ?? ""}"?`}
        description="Các dịch vụ thuộc loại này sẽ bị ảnh hưởng."
        confirmLabel="Xóa"
      />
    </div>
  );
};

export default ServiceManagementPage;
