import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNotification, useAuth } from "@/context/ContextProvider";
import { housekeepingService } from "@/services/housekeeping/housekeepingService";
import Section from "./Section";
import TaskCard from "./TaskCard";
import LoadingSection from "@/components/common/LoadingSection";
import RefreshButton from "@/components/common/RefreshButton";

const HousekeepingPage = () => {
  const toast = useNotification();
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await housekeepingService.getTasks();
      console.log(res);
      if (res.success) setTasks(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaim = async (taskId) => {
    try {
      const res = await housekeepingService.claimTask(taskId);

      if (res.success) {
        toast.success("Thành công", "Đã nhận phòng để dọn.");
        setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      } else {
        toast.error("Lỗi", res.message ?? "Có lỗi xảy ra.");
      }
    } catch (e) {
      toast.error("Lỗi", e?.message ?? "Có lỗi xảy ra.");
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const res = await housekeepingService.completeTask(taskId);
      if (res.success) {
        toast.success("Thành công", "Hoàn thành dọn phòng.");
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        toast.error("Lỗi", res.message ?? "Có lỗi xảy ra.");
      }
    } catch (e) {
      toast.error("Lỗi", e?.message ?? "Có lỗi xảy ra.");
    }
  };

  const pending = tasks.filter((t) => t.status === "PENDING");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 bg-[#120d1e]/95 backdrop-blur-md px-5 py-4 rounded-[8px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.65)] mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-400">
            <span className="font-mono text-violet-300">{tasks.length}</span>{" "}
            phòng cần xử lý
          </span>
        </div>
        <RefreshButton onClick={fetchTasks} label="Cập nhật" />
      </div>

      {loading ? (
        <LoadingSection />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <CheckCircle2 size={32} className="text-emerald-500/30" />
          <p className="text-xs font-medium text-zinc-500">
            Tất cả phòng đã sạch
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Đang dọn */}
          {inProgress.length > 0 && (
            <Section title="Đang dọn" count={inProgress.length} color="#f97316">
              {inProgress.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUser={currentUser}
                  onComplete={() => handleComplete(task.id)}
                />
              ))}
            </Section>
          )}

          {/* Chờ dọn */}
          {pending.length > 0 && (
            <Section title="Chờ dọn" count={pending.length} color="#eab308">
              {pending.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClaim={() => handleClaim(task.id)}
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
};

export default HousekeepingPage;
