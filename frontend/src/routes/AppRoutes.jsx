import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Customer Pages
import HomePage from '../pages/customer/HomePage';
import ProductsPage from '../pages/customer/ProductsPage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrdersPage from '../pages/customer/OrdersPage';
import OrderDetailPage from '../pages/customer/OrderDetailPage';
import ProfilePage from '../pages/customer/ProfilePage';
import NotificationsPage from '../pages/customer/NotificationsPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminInventory from '../pages/admin/AdminInventory';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSystemHealth from '../pages/admin/AdminSystemHealth';
import AdminApiMonitor from '../pages/admin/AdminApiMonitor';

// Layout wrapper for customer storefront
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
      <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
      <Route path="/product/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
      <Route path="/orders" element={<CustomerLayout><OrdersPage /></CustomerLayout>} />
      <Route path="/orders/:id" element={<CustomerLayout><OrderDetailPage /></CustomerLayout>} />
      <Route path="/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
      <Route path="/notifications" element={<CustomerLayout><NotificationsPage /></CustomerLayout>} />

      {/* Auth Routes */}
      <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />
      <Route path="/register" element={<CustomerLayout><RegisterPage /></CustomerLayout>} />

      {/* Admin Portal Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/inventory" element={<AdminInventory />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/system-health" element={<AdminSystemHealth />} />
      <Route path="/admin/api-monitor" element={<AdminApiMonitor />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
