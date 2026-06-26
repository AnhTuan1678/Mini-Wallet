# Đặc tả API (High-level)

## 1. Authentication

| Method | Endpoint         | Mục đích                                 |
| ------ | ---------------- | ---------------------------------------- |
| POST   | `/auth/register` | Đăng ký Customer, tạo Customer và Pocket |
| POST   | `/auth/login`    | Đăng nhập Customer, trả JWT Token        |
| POST   | `/admin/login`   | Đăng nhập Officer                        |
| POST   | `/auth/logout`   | Đăng xuất                                |

---

## 2. Customer

| Method | Endpoint             | Mục đích                     |
| ------ | -------------------- | ---------------------------- |
| GET    | `/customers/profile` | Lấy thông tin khách hàng     |
| GET    | `/customers/balance` | Xem số dư ví                 |
| GET    | `/customers/history` | Lịch sử giao dịch thành công |

---

## 3. Wallet (Pocket)

| Method | Endpoint               | Mục đích                     |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/wallets/:id`         | Thông tin Pocket             |
| GET    | `/wallets/:id/entries` | Danh sách PocketEntry của ví |

---

## 4. Transaction Engine

### Request

| Method | Endpoint               | Mục đích                                                      |
| ------ | ---------------------- | ------------------------------------------------------------- |
| POST   | `/transaction/request` | Tạo TransactionTrail, validate dữ liệu, tính phí, trả Preview |

---

### Confirm

| Method | Endpoint               | Mục đích                                                   |
| ------ | ---------------------- | ---------------------------------------------------------- |
| POST   | `/transaction/confirm` | Xác nhận giao dịch, trả về phương thức xác thực (PIN/NONE) |

---

### Verify

| Method | Endpoint              | Mục đích                                                                      |
| ------ | --------------------- | ----------------------------------------------------------------------------- |
| POST   | `/transaction/verify` | Kiểm PIN, thực hiện giao dịch, cập nhật số dư, tạo Transaction và PocketEntry |

---

## 5. Cash-in

| Method | Endpoint         | Mục đích                                             |
| ------ | ---------------- | ---------------------------------------------------- |
| POST   | `/admin/cash-in` | Officer nạp tiền từ Bank Pocket sang Customer Pocket |

---

## 6. Transaction

| Method | Endpoint                          | Mục đích                                   |
| ------ | --------------------------------- | ------------------------------------------ |
| GET    | `/transactions/:transRefId`       | Chi tiết biên lai                          |
| GET    | `/transaction-trails/:transRefId` | Xem trạng thái và log của TransactionTrail |

---

# API Quản trị (Officer)

## 1. Service

| Method | Endpoint              | Mục đích          |
| ------ | --------------------- | ----------------- |
| GET    | `/admin/services`     | Danh sách Service |
| POST   | `/admin/services`     | Tạo Service       |
| PUT    | `/admin/services/:id` | Cập nhật Service  |
| DELETE | `/admin/services/:id` | Xóa Service       |

---

## 2. Transaction Design

### TransField

| Method | Endpoint                           | Mục đích             |
| ------ | ---------------------------------- | -------------------- |
| GET    | `/admin/services/:id/trans-fields` | Danh sách TransField |
| POST   | `/admin/trans-fields`              | Thêm TransField      |
| PUT    | `/admin/trans-fields/:id`          | Cập nhật TransField  |
| DELETE | `/admin/trans-fields/:id`          | Xóa TransField       |

### TransValidation

| Method | Endpoint                                | Mục đích             |
| ------ | --------------------------------------- | -------------------- |
| GET    | `/admin/services/:id/trans-validations` | Danh sách Validation |
| POST   | `/admin/trans-validations`              | Thêm Validation      |
| PUT    | `/admin/trans-validations/:id`          | Cập nhật Validation  |
| DELETE | `/admin/trans-validations/:id`          | Xóa Validation       |

### TransDefinition

| Method | Endpoint                               | Mục đích         |
| ------ | -------------------------------------- | ---------------- |
| GET    | `/admin/services/:id/trans-definition` | Lấy glSteps      |
| POST   | `/admin/trans-definition`              | Tạo glSteps      |
| PUT    | `/admin/trans-definition/:id`          | Cập nhật glSteps |

---

## 3. Wallet Management

| Method | Endpoint             | Mục đích               |
| ------ | -------------------- | ---------------------- |
| GET    | `/admin/pockets`     | Danh sách Pocket       |
| POST   | `/admin/pockets`     | Tạo Pocket System/Bank |
| PUT    | `/admin/pockets/:id` | Cập nhật Pocket        |

---

## 4. Biller

| Method | Endpoint             | Mục đích         |
| ------ | -------------------- | ---------------- |
| GET    | `/admin/billers`     | Danh sách Biller |
| POST   | `/admin/billers`     | Tạo Biller       |
| PUT    | `/admin/billers/:id` | Cập nhật Biller  |
| DELETE | `/admin/billers/:id` | Xóa Biller       |

---

## 5. Customer Management

| Method | Endpoint                      | Mục đích              |
| ------ | ----------------------------- | --------------------- |
| GET    | `/admin/customers`            | Danh sách Customer    |
| GET    | `/admin/customers/:id`        | Chi tiết Customer     |
| PUT    | `/admin/customers/:id/status` | Khóa/Mở khóa Customer |

---

## 6. Transaction Monitoring

| Method | Endpoint                                | Mục đích                   |
| ------ | --------------------------------------- | -------------------------- |
| GET    | `/admin/transaction-trails`             | Danh sách TransactionTrail |
| GET    | `/admin/transaction-trails/:transRefId` | Chi tiết TransactionTrail  |
| GET    | `/admin/transactions`                   | Danh sách Transaction      |
| GET    | `/admin/transactions/:transRefId`       | Chi tiết Transaction       |
