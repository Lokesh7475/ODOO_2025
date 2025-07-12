import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaTrash, FaBan, FaCheck, FaTimes, FaEye, FaUsers, FaBox, FaExchangeAlt, FaChartBar } from "react-icons/fa";

// Mock admin data
const admin = {
  name: "Admin User",
  email: "admin@swapify.com",
  avatar: null,
};

// Mock users data
const users = [
  { id: 1, name: "Jane Doe", email: "jane@example.com", role: "User", status: "Active" },
  { id: 2, name: "John Smith", email: "john@example.com", role: "User", status: "Suspended" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 4, name: "Bob Wilson", email: "bob@example.com", role: "User", status: "Active" },
];

// Mock listings data
const listings = [
  { id: 1, title: "Blue Denim Jacket", owner: "Jane Doe", status: "Active", img: "https://source.unsplash.com/100x100?jacket" },
  { id: 2, title: "Floral Summer Dress", owner: "Alice Johnson", status: "Swapped", img: "https://source.unsplash.com/100x100?dress" },
  { id: 3, title: "Red Scarf", owner: "Bob Wilson", status: "Active", img: "https://source.unsplash.com/100x100?scarf" },
];

// Mock swap requests data
const swapRequests = [
  { id: 1, itemName: "Blue Denim Jacket", requester: "John Smith", owner: "Jane Doe", status: "Pending" },
  { id: 2, itemName: "Floral Summer Dress", requester: "Bob Wilson", owner: "Alice Johnson", status: "Accepted" },
  { id: 3, itemName: "Red Scarf", requester: "Jane Doe", owner: "Bob Wilson", status: "Rejected" },
];

// Mock reports data
const reports = [
  { id: 1, reason: "Inappropriate content", item: "Blue Denim Jacket", user: "John Smith", status: "Pending" },
  { id: 2, reason: "Fake item", item: "Floral Summer Dress", user: "Alice Johnson", status: "Reviewed" },
  { id: 3, reason: "Spam", item: "Red Scarf", user: "Bob Wilson", status: "Pending" },
];

const adminSections = [
  { id: "users", label: "Manage Users", icon: <FaUsers />, count: users.length },
  { id: "listings", label: "Manage Listings", icon: <FaBox />, count: listings.length },
  { id: "swaps", label: "Manage Swaps", icon: <FaExchangeAlt />, count: swapRequests.length },
  { id: "reports", label: "Reports", icon: <FaChartBar />, count: reports.length },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("users");

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Reviewed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3" aria-label="Admin navigation">
          <div className="flex items-center gap-2">
            <img src="/logo192.png" alt="Swapify Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-indigo-700 tracking-tight">Swapify Admin</span>
          </div>
          <ul className="hidden md:flex gap-8 text-slate-700 font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition">Dashboard</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Users</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Listings</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Reports</a></li>
          </ul>
          <div className="flex items-center gap-3">
            {admin.avatar ? (
              <img src={admin.avatar} alt={admin.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FaUserCircle className="text-2xl text-indigo-300" />
            )}
            <span className="hidden sm:block text-sm text-slate-600">{admin.name}</span>
          </div>
        </nav>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen hidden lg:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {adminSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      activeSection === section.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span>{section.label}</span>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                      {section.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden w-full bg-white border-b border-slate-200">
          <nav className="flex overflow-x-auto">
            {adminSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition ${
                  activeSection === section.id
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === "users" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Users</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <FaEdit />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <FaTrash />
                              </button>
                              <button className="text-yellow-600 hover:text-yellow-900">
                                <FaBan />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === "listings" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Listings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <article key={listing.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={listing.img} alt={listing.title} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{listing.title}</h3>
                        <p className="text-sm text-slate-500">Owner: {listing.owner}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                      <span className="text-xs text-slate-500">ID: {listing.id}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition flex items-center justify-center gap-1">
                        <FaCheck /> Approve
                      </button>
                      <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition flex items-center justify-center gap-1">
                        <FaTimes /> Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSection === "swaps" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Swap Requests</h2>
              <div className="space-y-4">
                {swapRequests.map((request) => (
                  <article key={request.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{request.itemName}</h3>
                        <p className="text-sm text-slate-500">
                          Requester: {request.requester} | Owner: {request.owner}
                        </p>
                        <p className="text-xs text-slate-400">Request ID: {request.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FaCheck />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSection === "reports" && (
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Reports & Feedback</h2>
              <div className="space-y-4">
                {reports.map((report) => (
                  <article key={report.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{report.reason}</h3>
                        <p className="text-sm text-slate-500">
                          Item: {report.item} | User: {report.user}
                        </p>
                        <p className="text-xs text-slate-400">Report ID: {report.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition">
                          Review
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
} 