import {
 Users,
 LayoutDashboard,
 ConciergeBell,
 Bed,
 BarChart3,
 Hotel,
 Sparkles,
 CalendarCheck2,
 Contact2,
 WashingMachine,
} from "lucide-react";

export const MENU_GROUPS = [
 {
 label: "Tổng quan",
 items: [
 { label: "Tổng quan", icon: LayoutDashboard, path: "/", allowedRoles: ["ADMIN", "HOUSEKEEPING", "RECEPTIONIST"] },
 { label: "Báo cáo", icon: BarChart3, path: "/reports", allowedRoles: ["ADMIN"] },
 ],
 },
 {
 label: "Phòng",
 items: [
 { label: "Quản lý phòng", icon: Bed, path: "/rooms", allowedRoles: ["ADMIN", "RECEPTIONIST"] },
 { label: "Loại phòng", icon: Hotel, path: "/room-type", allowedRoles: ["ADMIN", "RECEPTIONIST"] },
 {
 label: "Tiện ích / giường",
 icon: ConciergeBell,
 path: "/room-config",
 allowedRoles: ["ADMIN", "RECEPTIONIST"],
 },
 {
 label: "Buồng phòng",
 icon: WashingMachine,
 path: "/housekeeping",
 allowedRoles: ["ADMIN", "HOUSEKEEPING"],
 },
 ],
 },
 {
 label: "Vận hành",
 items: [
 { label: "Đặt phòng", icon: CalendarCheck2, path: "/bookings", allowedRoles: ["ADMIN", "RECEPTIONIST"] },
 { label: "Dịch vụ", icon: Sparkles, path: "/services", allowedRoles: ["ADMIN", "RECEPTIONIST"] },
 ],
 },
 {
 label: "Người dùng",
 items: [
 { label: "Người dùng", icon: Users, path: "/customers", allowedRoles: ["ADMIN", "RECEPTIONIST"] },
 { label: "Tài khoản", icon: Contact2, path: "/users", allowedRoles: ["ADMIN"] },
 ],
 },
];
