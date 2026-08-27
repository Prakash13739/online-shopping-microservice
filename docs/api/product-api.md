# Product Service API Specification

Base URL: `http://localhost:8080/api/products` and `/api/categories`

## 1. List Products (with Search, Filter, Sort, Pagination)
- **Method**: `GET`
- **Path**: `/api/products?page=0&size=12&categoryId=1&search=headphone&minPrice=100&maxPrice=500&sort=price,asc`
- **Auth**: Public
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Aura Ultra Wireless ANC Headphones",
        "slug": "aura-ultra-wireless-anc-headphones",
        "description": "Premium active noise-cancelling over-ear headphones...",
        "sku": "ELEC-AUR-001",
        "brand": "AuraSound",
        "price": 299.99,
        "discountPrice": 249.99,
        "categoryId": 1,
        "categoryName": "Electronics",
        "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "rating": 4.85,
        "reviewCount": 342,
        "status": "ACTIVE"
      }
    ],
    "page": 0,
    "size": 12,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 2. Get Product By ID
- **Method**: `GET`
- **Path**: `/api/products/{id}`
- **Auth**: Public
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Product found",
  "data": {
    "id": 1,
    "name": "Aura Ultra Wireless ANC Headphones",
    "slug": "aura-ultra-wireless-anc-headphones",
    "description": "Premium active noise-cancelling over-ear headphones...",
    "sku": "ELEC-AUR-001",
    "brand": "AuraSound",
    "price": 299.99,
    "discountPrice": 249.99,
    "categoryId": 1,
    "categoryName": "Electronics",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    "rating": 4.85,
    "reviewCount": 342,
    "status": "ACTIVE"
  },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 3. Create Product (Admin Only)
- **Method**: `POST`
- **Path**: `/api/products`
- **Auth**: `ROLE_ADMIN`
- **Request Body**:
```json
{
  "name": "Wireless Charging Pad",
  "description": "15W fast wireless Qi charger",
  "sku": "ELEC-CHG-037",
  "brand": "PowerPro",
  "price": 39.99,
  "discountPrice": 29.99,
  "categoryId": 1,
  "imageUrl": "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500",
  "status": "ACTIVE"
}
```

## 4. List Categories
- **Method**: `GET`
- **Path**: `/api/categories`
- **Auth**: Public
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Cutting-edge smartphones, laptops, and gadgets",
      "imageUrl": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      "productCount": 5
    }
  ],
  "timestamp": "2026-08-27T20:30:00"
}
```
