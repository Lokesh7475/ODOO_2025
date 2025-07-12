import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ItemListingPage from "./ItemListingPage";
import ProductDetailPage from "./ProductDetailPage";
import DashboardPage from "./DashboardPage";
import AdminPage from "./AdminPage";
import AddProductPage from "./AddProductPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/browse" element={<ItemListingPage />} />
        <Route path="/items/:id" element={<ProductDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
