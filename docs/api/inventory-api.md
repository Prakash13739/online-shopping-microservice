# Inventory Service API Specification

Base URL: `http://localhost:8080/api/inventory`

## 1. Get Inventory by Product ID
- **Method**: `GET`
- **Path**: `/api/inventory/{productId}`
- **Auth**: Public / Internal
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Inventory retrieved",
  "data": {
    "id": 1,
    "productId": 1,
    "sku": "ELEC-AUR-001",
    "quantityAvailable": 45,
    "quantityReserved": 0,
    "reorderLevel": 10,
    "status": "IN_STOCK"
  },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 2. Reserve Stock (Saga Step 1)
- **Method**: `POST`
- **Path**: `/api/inventory/reserve`
- **Auth**: Internal / Order Service
- **Request Body**:
```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 16, "quantity": 1 }
  ]
}
```
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Stock reserved successfully",
  "data": { "reserved": true },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 3. Deduct Stock (Saga Step 3 on Payment Success)
- **Method**: `POST`
- **Path**: `/api/inventory/deduct`
- **Auth**: Internal / Order Service
- **Request Body**:
```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 16, "quantity": 1 }
  ]
}
```

## 4. Release Reserved Stock (Saga Compensation on Payment Failure)
- **Method**: `POST`
- **Path**: `/api/inventory/release`
- **Auth**: Internal / Order Service
- **Request Body**:
```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 16, "quantity": 1 }
  ]
}
```
