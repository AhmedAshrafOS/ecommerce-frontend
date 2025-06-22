import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { User, MapPin, Lock, Phone, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function CustomerProfile() {
  const {
    customerProfile,
    addresses,
    updateProfile,
    createAddress,
    deleteAddress,
  } = useContext(ShopContext);

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    governorate: "",
    buildingNumber: "",
    apartmentNumber: "",
    floor: "",
    country: "",
    isPrimary: false,
  });
  const [isAdding, setIsAdding] = useState(false);

  // password form
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  useEffect(() => {
    if (!customerProfile) return;
    setProfileForm({
      username: customerProfile.userName,
      email: customerProfile.email,
      firstName: customerProfile.firstName,
      lastName: customerProfile.lastName,
      phone: customerProfile.phoneNumber,
    });
    setSelectedAddressId(customerProfile.addresses[0]?.addressId || "");
  }, [customerProfile, addresses]);

  const onProfileChange = (f, v) => {
    setProfileForm((p) => ({ ...p, [f]: v }));
  };
  const onSaveProfile = () => {
    updateProfile(profileForm);
  };

  const onAddressChange = (f, v) =>
    setNewAddress((a) => ({ ...a, [f]: v }));
  const onAddAddress = () => {
    createAddress(newAddress);
    setIsAdding(false);
    setNewAddress({
      street: "",
      city: "",
      governorate: "",
      buildingNumber: "",
      apartmentNumber: "",
      floor: "",
      country: "",
      isPrimary: false,
    });
  };
  const onDeleteAddress = () => {
    const idx = addresses.findIndex((a) => a.addressId === selectedAddressId);
    deleteAddress(selectedAddressId, idx);
  };

  const onPwChange = (f, v) => setPwForm((p) => ({ ...p, [f]: v }));
  const onChangePassword = () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    updateProfile(pwForm);
    setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold">Customer Profile</h1>
      </div>

      {/* Personal Information */}
      <section className="bg-white border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 p-4 border-b">
          <User className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Username (editable) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => onProfileChange("username", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            {/* Email (editable) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => onProfileChange("email", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            {/* First Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) =>
                  onProfileChange("firstName", e.target.value)
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) =>
                  onProfileChange("lastName", e.target.value)
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            {/* Phone */}
            <div className="space-y-1 sm:col-span-2">
              <label className="flex text-sm font-medium  items-center gap-1">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) =>
                  onProfileChange("phone", e.target.value)
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
          </div>
        </div>
        <div className="p-4 border-t text-right">
          <button
            onClick={onSaveProfile}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Save Personal Info
          </button>
        </div>
      </section>

      {/* Addresses */}
      <section className="bg-white border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 p-4 border-b">
          <MapPin className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Addresses</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none"
            >
              {addresses.map((a) => (
                <option key={a.addressId} value={a.addressId}>
                  {a.addressId} — {a.street}, {a.city}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 border rounded px-3 py-2 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          {isAdding && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 relative">
                <button
                  onClick={() => setIsAdding(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                  &times;
                </button>
                <h3 className="text-lg font-medium">Add New Address</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {[
                    "street",
                    "city",
                    "governorate",
                    "buildingNumber",
                    "floor",
                    "apartmentNumber",
                    "country",
                  ].map((f) => (
                    <div key={f} className="space-y-1">
                      <label className="block text-sm font-medium">
                        {f}
                      </label>
                      <input
                        value={newAddress[f]}
                        onChange={(e) =>
                          onAddressChange(f, e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAddress.isPrimary}
                      onChange={(e) =>
                        onAddressChange("isPrimary", e.target.checked)
                      }
                      className="rounded focus:ring"
                    />
                    <label className="text-sm">Set as primary</label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded border hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onAddAddress}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Address */}
          {selectedAddressId && (
            <div className="p-4 border rounded-md bg-gray-50 space-y-2">
              {(() => {
                const a = addresses.find(
                  (x) => x.addressId === selectedAddressId
                );
                return a ? (
                  <>
                    <p>
                      {a.street}, Bldg {a.buildingNumber}, Floor {a.floor}, Apt{" "}
                      {a.apartmentNumber}
                    </p>
                    <p>
                      {a.city}, {a.governorate}, {a.country}
                    </p>
                    <div className="text-right">
                      <button
                        onClick={onDeleteAddress}
                        className="flex items-center gap-1 text-red-600 hover:underline"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-white border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 p-4 border-b">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>
        <div className="p-4 space-y-4">
          {/* Old Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              value={pwForm.oldPassword}
              onChange={(e) => onPwChange("oldPassword", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>
          {/* New Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => onPwChange("newPassword", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>
          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) => onPwChange("confirmPassword", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>
          {pwForm.newPassword &&
            pwForm.confirmPassword &&
            pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          <div className="text-right">
            <button
              onClick={onChangePassword}
              disabled={
                !pwForm.oldPassword ||
                !pwForm.newPassword ||
                pwForm.newPassword !== pwForm.confirmPassword
              }
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              Update Password
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
