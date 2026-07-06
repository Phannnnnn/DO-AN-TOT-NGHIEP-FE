import { useEffect, useState, useMemo } from "react";
import LoadingSection from "@/components/common/LoadingSection";
import { useNotification } from "@/context/ContextProvider";
import UserFormModal from "./UserFormModal";
import ResetPasswordModal from "./ResetPasswordModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchPrimary from "@/components/common/SearchPrimary";
import AddButton from "@/components/common/AddButton";
import { userService } from "@/services";
import UserTable from "./UserTable";
import Pagination from "@/components/common/Pagination";

const LIMIT_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

const UserPage = () => {
  const toast = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(LIMIT_OPTIONS[0]);
  const [totalPage, setTotalPage] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.users({ page: page, limit: pageLimit });
      if (res.success) {
        setUsers(res.data.users || []);
        setTotalPage(res.data.totalPage);
      }
    } catch (e) {
      toast.error("Lỗi", "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageLimit, totalPage]);

  // Filter (client-side) – tìm theo username, fullName, email
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        !q ||
        u.userName?.toLowerCase().includes(q) ||
        u.customer?.fullName?.toLowerCase().includes(q) ||
        u.customer?.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  // ── Submit (create / update) ─────────────────────
  const handleSubmit = async (data) => {
    try {
      let res;
      if (selectedUser?.id) {
        res = await userService.update(selectedUser.id, data);
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? res.data : u)),
          );
          toast.success("Thành công", "Cập nhật thành công.");
          setIsFormOpen(false);
          setSelectedUser(null);
        } else {
          toast.error("Lỗi", extractError(res));
        }
      } else {
        res = await userService.create(data);
        if (res.success) {
          // Refetch to get full user data with customer relation
          await fetchUsers();
          toast.success("Thành công", "Thêm người dùng thành công.");
          setIsFormOpen(false);
          setSelectedUser(null);
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
      const res = await userService.remove(deleteTarget.id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        toast.success("Thành công", "Xóa người dùng thành công.");
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

  // ── Reset password ──────────────────────────────
  const handleResetPassword = async (data) => {
    if (!resetTarget) return;
    try {
      const res = await userService.resetPassword(resetTarget.id, data);
      if (res.success) {
        toast.success("Thành công", "Đặt lại mật khẩu thành công.");
        setResetOpen(false);
        setResetTarget(null);
      } else {
        toast.error("Lỗi", extractError(res));
      }
    } catch (e) {
      toast.error("Lỗi", extractError(e));
    }
  };

  const extractError = (err) =>
    Array.isArray(err?.message)
      ? err.message.map((e) => e.error || e).join(", ")
      : (err?.message ?? "Có lỗi xảy ra");

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 sticky top-0 z-30 bg-[#120d1e]/90 backdrop-blur-md px-4 py-3 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
        <SearchPrimary
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Tìm kiếm ..."
        />
        <div className="flex justify-end">
          <AddButton
            onAddItem={() => {
              setSelectedUser(null);
              setIsFormOpen(true);
            }}
            addLabel="Thêm tài khoản"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <LoadingSection />
        ) : (
          <UserTable
            users={filtered}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsFormOpen(true);
            }}
            onDelete={(user) => {
              setDeleteTarget(user);
              setConfirmOpen(true);
            }}
            onResetPassword={(user) => {
              setResetTarget(user);
              setResetOpen(true);
            }}
          />
        )}
      </div>

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

      {/* Form modal */}
      <UserFormModal
        isOpen={isFormOpen}
        initialData={selectedUser}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmit}
      />

      {/* Reset password modal */}
      <ResetPasswordModal
        isOpen={resetOpen}
        user={resetTarget}
        onClose={() => {
          setResetOpen(false);
          setResetTarget(null);
        }}
        onSubmit={handleResetPassword}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Xóa người dùng "${deleteTarget?.userName ?? ""}"?`}
        description="Hành động này không thể hoàn tác. Tài khoản sẽ bị xóa vĩnh viễn."
        confirmLabel="Xóa"
      />
    </div>
  );
};

export default UserPage;
