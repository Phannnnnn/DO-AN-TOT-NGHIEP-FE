# src/guards/
# ├── AuthGuard.js          # Bảo vệ routes cần authentication
# ├── RoleGuard.js          # Bảo vệ routes theo role/permission
# ├── PublicRoute.js        # Routes chỉ cho user chưa login
# ├── PrivateRoute.js       # Routes chỉ cho user đã login
# ├── AdminGuard.js         # Routes chỉ cho admin
# ├── GuestGuard.js         # Routes cho guest users
# └── index.js              # Export all guards