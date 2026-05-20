import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import CustomerFormModal from "./CustomerFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchPrimary from "@/components/common/SearchPrimary";
import AddButton from "@/components/common/AddButton";
import { customerService } from "@/services";
import CustomerTable from "./CustomerTable";

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.customers();
      if (res.success) setCustomers(res.data || []);
    } catch (e) {
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter (client‑side) – tìm theo tên, SĐT, email, CCCD
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        c.fullName?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.idNumber?.includes(q),
    );
  }, [customers, searchQuery]);

  // ── Submit (tập trung ở page) ─────────────────────
  const handleSubmit = async (data) => {
    try {
      let res;
      if (selectedCustomer?.customerId) {
        res = await customerService.update(selectedCustomer.customerId, data);
        if (res.success) {
          setCustomers((prev) =>
            prev.map((c) =>
              c.customerId === selectedCustomer.customerId ? res.data : c,
            ),
          );
          toast.success("Cập nhật thành công.");
          setIsFormOpen(false);
          setSelectedCustomer(null);
        } else {
          toast.error(extractError(res));
        }
      } else {
        res = await customerService.create(data);
        if (res.success) {
          setCustomers((prev) => [...prev, res.data]);
          toast.success("Thêm thành công.");
          setIsFormOpen(false);
          setSelectedCustomer(null);
        } else {
          toast.error(extractError(res));
        }
      }
    } catch (error) {
      toast.error(extractError(error));
    }
  };

  // ── Delete ──────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await customerService.remove(deleteTarget.customerId);
      if (res.success) {
        setCustomers((prev) =>
          prev.filter((c) => c.customerId !== deleteTarget.customerId),
        );
        toast.success("Xóa khách hàng thành công.");
      } else {
        toast.error(extractError(res));
      }
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setDeleteTarget(null);
      setConfirmOpen(false);
    }
  };

  const extractError = (err) =>
    Array.isArray(err?.message)
      ? err.message.map((e) => e.error).join(", ")
      : (err?.message ?? "Có lỗi xảy ra");

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0f0a19]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 bg-[#0d0d1a]/85 backdrop-blur-[12px] px-5 py-4 rounded-[0.875rem] border border-violet-500/12 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex">
          <SearchPrimary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Tìm theo tên, SĐT, email, CCCD..."
          />
        </div>
        <AddButton
          onAddItem={() => {
            setSelectedCustomer(null);
            setIsFormOpen(true);
          }}
          addLabel="Thêm người dùng"
        />
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#b026ff]" size={32} />
          </div>
        ) : (
          <CustomerTable
            customers={filtered}
            onEdit={(customer) => {
              setSelectedCustomer(customer);
              setIsFormOpen(true);
            }}
            onDelete={(customer) => {
              setDeleteTarget(customer);
              setConfirmOpen(true);
            }}
          />
        )}
      </div>

      {/* Form modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        initialData={selectedCustomer}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmit}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Xóa người dùng "${deleteTarget?.fullName ?? ""}"?`}
        description="Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
      />
    </div>
  );
};

export default CustomerManagementPage;
