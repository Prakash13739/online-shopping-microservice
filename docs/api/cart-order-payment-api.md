# Cart, Order & Payment Service API Specifications

## Cart Service API (`/api/cart`)

### 1. Get User Cart
- **Method**: `GET`
- **Path**: `/api/cart`
- **Auth**: `Bearer <token>`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Cart retrieved",
  "data": {
    "id": 1,
    "userId": 2,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Aura Ultra Wireless ANC Headphones",
        "productImage": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "unitPrice": 249.99,
        "quantity": 1,
        "subtotal": 249.99
      }
    ],
    "totalItems": 1,
    "totalAmount": 249.99
  }
}
```

### 2. Add Item to Cart
- **Method**: `POST`
- **Path**: `/api/cart/items`
- **Auth**: `Bearer <token>`
- **Body**: `{ "productId": 1, "quantity": 1 }`

---

## Order Service API (`/api/orders`)

### 1. Place Order (Saga Orchestration)
- **Method**: `POST`
- **Path**: `/api/orders`
- **Auth**: `Bearer <token>`
- **Body**:
```json
{
  "shippingAddress": "Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477",
  "paymentMethod": "UPI",
  "simulateFailure": false,
  "items": [
    {
      "productId": 1,
      "productName": "Aura Ultra Wireless ANC Headphones",
      "productImage": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "unitPrice": 249.99,
      "quantity": 1
    }
  ]
}
```
- **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Order placed and confirmed successfully",
  "data": {
    "id": 6,
    "orderNumber": "ORD-20260827-9941",
    "status": "CONFIRMED",
    "totalAmount": 249.99,
    "shippingAmount": 0.00,
    "grandTotal": 249.99,
    "paymentMethod": "UPI",
    "shippingAddress": "Jane Doe, 742 Evergreen Terrace, Springfield, OR 97477",
    "createdAt": "2026-08-27T20:30:00"
  }
}
```

### 2. Update Order Status (Admin)
- **Method**: `PUT`
- **Path**: `/api/orders/{id}/status`
- **Auth**: `ROLE_ADMIN`
- **Body**: `{ "status": "SHIPPED" }`

---

## Payment Service API (`/api/payments`)

### 1. Process Payment Simulation
- **Method**: `POST`
- **Path**: `/api/payments`
- **Auth**: Internal / Order Service
- **Body**:
```json
{
  "orderId": 6,
  "userId": 2,
  "amount": 249.99,
  "paymentMethod": "UPI",
  "simulateFailure": false
}
```
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "transactionId": "TXN-882910394857-UPI",
    "status": "SUCCESS",
    "amount": 249.99
  }
}
```
