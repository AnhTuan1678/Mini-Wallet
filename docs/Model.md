# Mini Wallet — Model Overview

## 1. Bức tranh tổng thể

Mini Wallet có 4 nhóm model chính:

| Nhóm | Model | Mục đích |
| --- | --- | --- |
| **Danh tính / Đối tác** | `Officer`, `Customer`, `Biller` | Ai dùng hệ thống, ai quản lý, ai nhận tiền hoá đơn |
| **Sổ tiền / Ledger** | `Currency`, `Pocket`, `PocketEntry` | Giữ số dư, ghi bút toán debit-credit, quản lý loại tiền |
| **Config nghiệp vụ** | `Service`, `TransField`, `TransValidation`, `TransDefinition` | Officer mô tả nghiệp vụ bằng dữ liệu để engine chạy |
| **Runtime giao dịch** | `TransactionTrail`, `Transaction` | Theo dõi luồng request-confirm-verify và lưu biên lai/thanh toán |

---

## 2. Quy ước chung cho tất cả model

### 2.1 Trường chung

Hầu hết model nên có các trường chung sau:

| Field | Kiểu | Vai trò |
| --- | --- | --- |
| `id` | Integer | Khóa chính nội bộ |
| `created_at` | Timestamp | Thời điểm tạo |
| `updated_at` | Timestamp | Thời điểm cập nhật |
| `status` | String | Trạng thái dùng chung |

<!-- > Gợi ý: với các model đối tượng, có thể thêm `created_by`/`updated_by` nếu cần audit. -->

### 2.2 Quy ước `status`

| Status | Dùng cho | Ý nghĩa |
| --- | --- | --- |
| `active` | Hầu hết model | Được phép sử dụng |
| `locked` | Pocket | Tạm khóa do rủi ro hoặc giao dịch đang xử lý |
| `pending` | TransactionTrail | Đã request, chờ confirm/verify |
| `done` | TransactionTrail | Đã hoàn thành |
| `failed` | TransactionTrail | Thất bại |
| `cancelled` | TransactionTrail | Bị hủy hoặc hết hạn |

---

## 3. Nhóm danh tính / đối tác

### 3.1 `Customer`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `phone` | Varchar | Có | Dùng đăng nhập, duy nhất |
| `pin_hash` | Varchar | Có | Lưu PIN dưới dạng hash |
| `pocket_id` | Integer | Có | Tham chiếu tới Pocket của customer |

#### Quan hệ

- 1 `Customer` có 1 `Pocket` loại `customer`.
- 1 `Customer` có nhiều `TransactionTrail`.
- 1 `Customer` có thể là sender hoặc receiver trong `Transaction`.

#### Index / unique

- Unique: `phone`.
- Index: `status`.

### 3.2 `Officer`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `username` | Varchar | Có | Dùng đăng nhập, duy nhất |
| `password_hash` | Varchar | Có | Mật khẩu dạng hash |

#### Quan hệ

- 1 `Officer` có thể tạo và quản lý nhiều config nghiệp vụ.
- 1 `Officer` có thể khởi tạo `TransactionTrail` cho cash-in.

#### Index / unique

- Unique: `username`.
- Index: `status`.

### 3.3 `Biller`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `code` | Varchar | Có | Mã biller, duy nhất |
| `name` | Varchar | Có | Tên hiển thị |
| `pocket_id` | Integer | có | Pocket nhận tiền |
| `inquiry_url` | Varchar | Có | URL tra cứu hoá đơn |
| `payment_url` | Varchar | Có | URL thanh toán hoá đơn |

#### Quan hệ

- 1 `Biller` có thể liên kết với 1 `Pocket` nhận tiền.
- `Biller` được dùng bởi `Service` khi thực hiện Bill Payment.

#### Index / unique

- Unique: `code`.
- Index: `status`.

---

## 4. Nhóm sổ tiền / Ledger

### 4.1 `Currency`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `code` | Varchar | Có | Ví dụ `VND` |
| `name` | Varchar | Có | Tên loại tiền |

#### Index / unique

- Unique: `code`.

### 4.2 `Pocket`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `owner_type` | Varchar | Có | `customer`, `biller`, `system`, `bank` |
| `owner_id` | Integer | Không | Id của chủ sở hữu nếu có |
| `currency_id` | Integer | Có | Loại tiền |
| `balance` | Decimal | Có | Số dư hiện tại |
| `checksum` | Varchar | Có | Dấu vân tay chống sửa tay |
| `status` | Varchar | Có | `active`, `locked`, `inactive` |
| `name` | Varchar | Không | Tên hiển thị cho ví System/Bank |

#### Quan hệ

- 1 `Pocket` thuộc về 1 `Customer` / `Biller` hoặc là ví đặc biệt của hệ thống.
- 1 `Pocket` có nhiều `PocketEntry` debit/credit.

#### Index / unique

- Index: `owner_type`, `owner_id`, `currency_id`, `status`.

### 4.3 `PocketEntry`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `trans_ref_id` | Varchar | Có | Mã tham chiếu TransactionTrail |
| `transaction_id` | Integer | Có | Tham chiếu Transaction |
| `step_order` | Integer | Có | Thứ tự bước ghi sổ |
| `debit_pocket_id` | Integer | Có | Ví bị trừ |
| `credit_pocket_id` | Integer | Có | Ví được cộng |
| `amount` | Decimal | Có | Số tiền |
| `status` | Varchar | Có | `settled`, `pending`, `failed` |
| `created_at` | Timestamp | Có | Thời điểm tạo |

#### Quan hệ

- 1 `PocketEntry` thuộc về 1 `Transaction` và 1 `TransactionTrail`.
- 1 `PocketEntry` liên kết với 2 `Pocket`: debit/credit.

#### Index

- Index: `trans_ref_id`, `debit_pocket_id`, `credit_pocket_id`, `created_at`.

---

## 5. Nhóm config nghiệp vụ

### 5.1 `Service`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `code` | Varchar | Có | Mã duy nhất của service |
| `name` | Varchar | Có | Tên hiển thị |
| `type` | Varchar | Có | Loại nghiệp vụ |
| `auth_method` | Varchar | Có | `PIN`, `NONE` |
| `fee_type` | Varchar | Có | `fixed`, `percent` |
| `fee_value` | Decimal | Có | Giá trị phí |
| `fee_max` | Decimal | Không | Mức phí tối đa |
| `action` | Varchar | Không | Tên hành động bổ sung |
| `action_params` | Text | Không | Tham số action |
| `field_builder` | Text | Không | Cấu hình dựng biến cho request |
| `status` | Varchar | Có | `draft`, `active`, `inactive` |
| `created_at` | Timestamp | Có | Thời điểm tạo |
| `updated_at` | Timestamp | Không | Thời điểm cập nhật |

#### Quan hệ

- 1 `Service` có nhiều `TransField`.
- 1 `Service` có nhiều `TransValidation`.
- 1 `Service` có 1 `TransDefinition`.
- 1 `Service` có nhiều `TransactionTrail` và `Transaction`.

#### Index / unique

- Unique: `code`.
- Index: `status`, `type`.

### 5.2 `TransField`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `service_id` | Integer | Có | Tham chiếu Service |
| `field_name` | Varchar | Có | Tên trường input |
| `field_format` | Varchar | Có | `string`, `number`, `phone`, `object` |
| `min_length` | Integer | Không | Độ dài tối thiểu |
| `max_length` | Integer | Không | Độ dài tối đa |
| `regex` | Varchar | Không | Kiểm định định dạng |
| `required` | Boolean | Có | Bắt buộc nhập |
| `order_no` | Integer | Có | Thứ tự validate |

#### Index

- Index: `service_id`, `status`, `order_no`.
- Unique gợi ý: `(service_id, field_name)`.

### 5.3 `TransValidation`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `service_id` | Integer | Có | Tham chiếu Service |
| `validate_func` | Varchar | Có | Hàm kiểm tra nghiệp vụ |
| `validate_fields` | Varchar | Có | Danh sách field liên quan |
| `order_no` | Integer | Có | Thứ tự chạy |
| `status` | Varchar | Có | `active`, `inactive` |

#### Index

- Index: `service_id`, `status`, `order_no`.

### 5.4 `TransDefinition`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `service_id` | Integer | Có | Tham chiếu Service |
| `gl_steps` | Text | Có | Danh sách step debit-credit |

#### `gl_steps[]`

| Field | Kiểu | Bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `order` | Integer | Có | Thứ tự chạy step |
| `amount` | Varchar | Có | Biến số tiền, ví dụ `AMOUNT`, `DEBITFEE` |
| `debit` | Object | Có | Ví bị trừ |
| `credit` | Object | Có | Ví được cộng |

#### `debit` / `credit`

| Field | Kiểu | Bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `level` | String | Có | Cách xác định ví: `productLevel`, `wallet` |
| `target` | String | Có | Biến runtime hoặc pocket id cố định |

#### Quy ước `level`

| `level` | Ý nghĩa | Ví dụ `target` |
| --- | --- | --- |
| `productLevel` | Lấy pocket id động từ `TRANSBODY` lúc runtime | `SENDERID`, `RECEIVERID` |
| `wallet` | Dùng pocket id cố định đã cấu hình | `<SYSTEM_POCKET_ID>`, `<BANK_POCKET_ID>` |

#### Index / unique

- Unique gợi ý: `service_id`.
- Index: `status`.

---

## 6. Nhóm runtime giao dịch

### 6.1 `TransactionTrail`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `trans_ref_id` | Varchar | Có | Mã tham chiếu chung |
| `service_id` | Integer | Có | Service đang chạy |
| `status` | Varchar | Có | `init`, `pending`, `done`, `failed`, `cancelled` |
| `input_message` | Text | Có | Request gốc |
| `output_message` | Text | Có | Dữ liệu `TRANSBODY` sau build |
| `preview_amount` | Decimal | Không | Số tiền gốc |
| `preview_fee` | Decimal | Không | Phí dự kiến |
| `preview_total` | Decimal | Không | Tổng dự kiến |
| `auth_method` | Varchar | Không | `PIN`, `NONE` |
| `trans_step_log` | Text | Không | Log chi tiết từng bước |
| `expired_at` | Timestamp | Không | Hạn phiên |

#### Index

- Index: `service_id`, `status`, `created_at`.
- Index: `trans_ref_id`.

### 6.2 `Transaction`

#### Field

| Field | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `id` | Integer | Có | Khóa chính |
| `trans_ref_id` | Varchar | Có | Tham chiếu TransactionTrail |
| `service_id` | Integer | Có | Service đang chạy |
| `sender_pocket_id` | Integer | Không | Pocket gửi tiền |
| `receiver_pocket_id` | Integer | Có | Pocket nhận tiền |
| `amount` | Decimal | Có | Số tiền gốc |
| `fee` | Decimal | Có | Phí sender trả |
| `total_amount` | Decimal | Có | `amount + fee` |

#### Quan hệ

- 1 `Transaction` liên kết với 1 `TransactionTrail`.
- 1 `Transaction` có nhiều `PocketEntry` debit/credit.

#### Index / unique

- Unique: `trans_ref_id`.
- Index: `service_id`, `sender_pocket_id`, `receiver_pocket_id`, `created_at`.
