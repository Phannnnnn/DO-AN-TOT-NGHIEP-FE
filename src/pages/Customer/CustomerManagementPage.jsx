import { useEffect, useState, useMemo } from "react";
import LoadingSection from "@/components/common/LoadingSection";
import { useNotification } from "@/context/ContextProvider";
import CustomerFormModal from "./CustomerFormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchPrimary from "@/components/common/SearchPrimary";
import AddButton from "@/components/common/AddButton";
import { customerService } from "@/services";
import CustomerTable from "./CustomerTable";
import Pagination from "@/components/common/Pagination";

const LIMIT_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

const CustomerManagementPage = () => {
  const toast = useNotification();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(LIMIT_OPTIONS[0]);
  const [totalPage, setTotalPage] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.customers({
        page: page,
        limit: pageLimit,
      });
      console.log(res);
      if (res.success) {
        setCustomers(res.data.customers || []);
        setTotalPage(res.data.totalPage);
      }
    } catch (e) {
      toast.error("Lỗi", "Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageLimit, totalPage]);

  // Filter (client‑side) – tìm theo tên, SĐT, email
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        c.fullName?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q),
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
          toast.success("Thành công", "Cập nhật thành công.");
          setIsFormOpen(false);
          setSelectedCustomer(null);
        } else {
          toast.error("Lỗi", extractError(res));
        }
      } else {
        res = await customerService.create(data);
        if (res.success) {
          setCustomers((prev) => [...prev, res.data]);
          toast.success("Thành công", "Thêm thành công.");
          setIsFormOpen(false);
          setSelectedCustomer(null);
        } else {
          toast.error("Lỗi", extractError(res));
        }
      }
    } catch (error) {
      toast.error("Lỗi", extractError(error));
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
        toast.success("Thành công", "Xóa khách hàng thành công.");
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
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
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 sticky top-0 z-30 bg-[#120d1e]/90 backdrop-blur-md px-4 py-3 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
        <SearchPrimary
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Tìm theo tên, SĐT, email..."
        />
        <div className="flex justify-end">
          <AddButton
            onAddItem={() => {
              setSelectedCustomer(null);
              setIsFormOpen(true);
            }}
            addLabel="Thêm người dùng"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <LoadingSection />
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

      <Pagination
        page={page}
        pageLimit={pageLimit}
        totalPage={totalPage}
        limitOptions={LIMIT_OPTIONS}
        onChangePage={(page) => {
          setPage(page);
        }}
        onChangeLimit={(limit) => {
          setPageLimit(limit);
        }}
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
