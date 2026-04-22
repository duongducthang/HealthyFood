# Backend (NestJS + TypeScript + Prisma)

Backend này chạy theo baseURL **`http://localhost:5000/api`** (khớp với FE của bạn đang cấu hình trong `src/services/axiosClient.js`).

## 1) Cài & chạy

Mở terminal tại thư mục `backend`:

```bash
npm install
npx prisma generate
npx prisma migrate dev
node prisma/seed.js
npm run build
npm run start
```

Sau khi chạy, API ở:

- `GET http://localhost:5000/api/health`

## 2) Cấu hình ENV

File dùng khi chạy local: `backend/.env`

```env
PORT=5000
CORS_ORIGINS=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=dev_secret_change_me_please_1234567890
JWT_EXPIRES_IN=7d
```

- **`CORS_ORIGINS`**: để FE gọi được API (Vite thường là `http://localhost:5173`).
- **`JWT_SECRET`**: đổi sang chuỗi dài khi deploy.

## 3) Tài khoản demo (seed)

Seed sẽ tạo 1 user:

- **email**: `demo@example.com`
- **password**: `123456`

## 4) API endpoints (khớp FE)

### Auth

- **POST** `/api/auth/register`

Body (JSON):

```json
{
  "userName": "Nguyễn Văn A",
  "birthday": "2000-01-01",
  "email": "a@gmail.com",
  "password": "123456",
  "phone": "0900000000",
  "gender": "Nam",
  "province": "Hà Nội",
  "district": "Ba Đình",
  "address": "Số nhà, tên đường..."
}
```

Response:

```json
{ "access_token": "...", "user": { "...": "..." } }
```

- **POST** `/api/auth/login`

Body:

```json
{ "email": "demo@example.com", "password": "123456" }
```

Response:

```json
{ "access_token": "...", "user": { "...": "..." } }
```

### User (cần Bearer token)

Tất cả endpoint dưới đây cần header:

`Authorization: Bearer <access_token>`

- **GET** `/api/users/me` → lấy profile + addresses
- **PUT** `/api/users/me` → cập nhật profile (phone/gender/birthday/avatar/…)
- **PUT** `/api/users/me/password` → đổi mật khẩu

### Addresses (cần Bearer token)

- **GET** `/api/users/me/addresses`
- **POST** `/api/users/me/addresses`
- **PUT** `/api/users/me/addresses/:id`
- **DELETE** `/api/users/me/addresses/:id`

Body create/update:

```json
{
  "name": "Nguyễn Văn A",
  "phone": "0900000000",
  "fullAddress": "Số nhà, Quận, Tỉnh",
  "isDefault": true
}
```

### Foods (Blog) (GET public, write cần Bearer token)

- **GET** `/api/foods?category=Bữa%20sáng&search=potato`
- **GET** `/api/foods/:id`
- **POST** `/api/foods`
- **PUT** `/api/foods/:id`
- **DELETE** `/api/foods/:id`

Body create/update (ví dụ):

```json
{
  "category": "Bữa sáng",
  "title": "Potatoes",
  "desc": "Short description...",
  "fullDesc": "Long description...",
  "imageUrl": "Potatoes.svg",
  "details": [
    { "name": "Baked Potato", "serving": "1 piece (173g)", "calories": "212" }
  ]
}
```

### Calories (Tracker) (cần Bearer token)

- **GET** `/api/calories/logs?date=2026-03-18`
- **POST** `/api/calories/logs`
- **PUT** `/api/calories/logs/:id`
- **DELETE** `/api/calories/logs/:id`

Body create/update (ví dụ):

```json
{ "date": "2026-03-18", "food": "Thịt gà", "unit": "100g", "qty": 100, "kcal": "239" }
```

## 5) Cách dùng từ FE

FE của bạn đã có `src/services/axiosClient.js`:

- set **`VITE_API_URL`** (nếu muốn) trong file `.env` của FE:

```env
VITE_API_URL=http://localhost:5000/api
```

Sau đó trong FE bạn gọi:

- Login:
  - `axiosClient.post("/auth/login", { email, password })`
  - Lưu `access_token` vào localStorage key **`access_token`**
  - Lưu `user` vào localStorage key **`user`** (hoặc map sang `currentUser` nếu bạn muốn giữ code hiện tại)

- Lấy profile:
  - `axiosClient.get("/users/me")`

- Lấy foods (Blog):
  - `axiosClient.get("/foods", { params: { category, search } })`
  - `axiosClient.get("/foods/" + id)`

- Nhật ký calo:
  - `axiosClient.get("/calories/logs", { params: { date } })`
  - `axiosClient.post("/calories/logs", payload)`

## 6) Ghi chú về chạy “mượt” trên Windows

- Trong môi trường terminal hiện tại, chế độ `nest start --watch` có thể lỗi spawn. Vì vậy local chạy ổn định nhất là:
  - `npm run build`
  - `npm run start`

