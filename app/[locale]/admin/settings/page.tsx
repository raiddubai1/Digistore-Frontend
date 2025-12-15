"use client";

import { useState, useEffect } from "react";
import { Settings, Store, CreditCard, Mail, Shield, Bell, Loader2, Save, Check, ArrowLeft, Key, Eye, EyeOff, Menu, Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

type SettingsTab = "general" | "payment" | "email" | "notifications" | "security" | "menu";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
}

interface SettingsData {
  // General
  storeName: string;
  storeTagline: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeLogo: string;
  // Payment
  currency: string;
  currencySymbol: string;
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalSecretKey: string;
  // Email
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  // Notifications
  emailOrderConfirmation: boolean;
  emailNewOrder: boolean;
  emailLowStock: boolean;
  emailNewReview: boolean;
  // Security
  sessionTimeout: string;
  maxLoginAttempts: string;
  requireEmailVerification: boolean;
  allowGuestCheckout: boolean;
  // Menu
  menuItems: MenuItem[];
}

const DEFAULT_SETTINGS: SettingsData = {
  storeName: "Digistore1",
  storeTagline: "Your Digital Products Marketplace",
  storeEmail: "contact@digistore1.com",
  storePhone: "",
  storeAddress: "",
  storeLogo: "",
  currency: "USD",
  currencySymbol: "$",
  stripeEnabled: false,
  stripePublicKey: "",
  stripeSecretKey: "",
  paypalEnabled: false,
  paypalClientId: "",
  paypalSecretKey: "",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPassword: "",
  smtpFromEmail: "",
  smtpFromName: "Digistore1",
  emailOrderConfirmation: true,
  emailNewOrder: true,
  emailLowStock: false,
  emailNewReview: true,
  sessionTimeout: "24",
  maxLoginAttempts: "5",
  requireEmailVerification: true,
  allowGuestCheckout: false,
  menuItems: [
    { id: "1", label: "Home", href: "/", enabled: true, order: 0 },
    { id: "2", label: "Shop", href: "/products", enabled: true, order: 1 },
    { id: "3", label: "Categories", href: "/categories", enabled: true, order: 2 },
    { id: "4", label: "New Arrivals", href: "/products?sort=newest", enabled: true, order: 3 },
    { id: "5", label: "Best Sellers", href: "/products?sort=bestsellers", enabled: true, order: 4 },
  ],
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null);
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...DEFAULT_SETTINGS, ...data.data });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show category selection
  if (!activeTab) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store settings and preferences</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SettingsCard icon={Store} title="General" desc="Store name, logo, contact" color="blue" onClick={() => setActiveTab("general")} />
          <SettingsCard icon={CreditCard} title="Payment" desc="Payment gateways, currencies" color="green" onClick={() => setActiveTab("payment")} />
          <SettingsCard icon={Mail} title="Email" desc="SMTP configuration" color="purple" onClick={() => setActiveTab("email")} />
          <SettingsCard icon={Bell} title="Notifications" desc="Email notification preferences" color="yellow" onClick={() => setActiveTab("notifications")} />
          <SettingsCard icon={Shield} title="Security" desc="Auth & password policies" color="red" onClick={() => setActiveTab("security")} />
          <SettingsCard icon={Menu} title="Menu" desc="Navigation menu items" color="cyan" onClick={() => setActiveTab("menu")} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab} Settings</h1>
            <p className="text-sm text-gray-500">Configure your {activeTab} preferences</p>
          </div>
        </div>
        <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        {activeTab === "general" && <GeneralSettings settings={settings} onChange={updateSetting} />}
        {activeTab === "payment" && <PaymentSettings settings={settings} onChange={updateSetting} />}
        {activeTab === "email" && <EmailSettings settings={settings} onChange={updateSetting} />}
        {activeTab === "notifications" && <NotificationSettings settings={settings} onChange={updateSetting} />}
        {activeTab === "security" && <SecuritySettings settings={settings} onChange={updateSetting} />}
        {activeTab === "menu" && <MenuSettings settings={settings} onChange={updateSetting} />}
      </div>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, desc, color, onClick }: { icon: any; title: string; desc: string; color: string; onClick: () => void }) {
  const colors: Record<string, string> = { blue: "from-blue-500 to-cyan-500", green: "from-green-500 to-emerald-500", purple: "from-purple-500 to-pink-500", yellow: "from-yellow-500 to-amber-500", red: "from-red-500 to-orange-500", cyan: "from-cyan-500 to-teal-500" };
  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}><Icon className="w-6 h-6 text-white" /></div>
      <h3 className="font-semibold text-gray-900 mb-2">{title} Settings</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div><p className="font-medium text-gray-900">{label}</p>{desc && <p className="text-sm text-gray-500">{desc}</p>}</div>
      <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function GeneralSettings({ settings, onChange }: { settings: SettingsData; onChange: (k: keyof SettingsData, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Store Name" value={settings.storeName} onChange={(v) => onChange("storeName", v)} />
        <Input label="Tagline" value={settings.storeTagline} onChange={(v) => onChange("storeTagline", v)} />
        <Input label="Contact Email" value={settings.storeEmail} onChange={(v) => onChange("storeEmail", v)} type="email" />
        <Input label="Phone Number" value={settings.storePhone} onChange={(v) => onChange("storePhone", v)} />
      </div>
      <Input label="Store Address" value={settings.storeAddress} onChange={(v) => onChange("storeAddress", v)} />
      <Input label="Logo URL" value={settings.storeLogo} onChange={(v) => onChange("storeLogo", v)} placeholder="https://..." />
    </div>
  );
}

function PaymentSettings({ settings, onChange }: { settings: SettingsData; onChange: (k: keyof SettingsData, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Currency Code" value={settings.currency} onChange={(v) => onChange("currency", v)} placeholder="USD" />
        <Input label="Currency Symbol" value={settings.currencySymbol} onChange={(v) => onChange("currencySymbol", v)} placeholder="$" />
      </div>
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Stripe</h3>
        <Toggle label="Enable Stripe" checked={settings.stripeEnabled} onChange={(v) => onChange("stripeEnabled", v)} />
        {settings.stripeEnabled && (
          <div className="mt-4 space-y-4">
            <Input label="Public Key" value={settings.stripePublicKey} onChange={(v) => onChange("stripePublicKey", v)} placeholder="pk_..." />
            <Input label="Secret Key" value={settings.stripeSecretKey} onChange={(v) => onChange("stripeSecretKey", v)} type="password" placeholder="sk_..." />
          </div>
        )}
      </div>
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">PayPal</h3>
        <Toggle label="Enable PayPal" checked={settings.paypalEnabled} onChange={(v) => onChange("paypalEnabled", v)} />
        {settings.paypalEnabled && (
          <div className="mt-4 space-y-4">
            <Input label="Client ID" value={settings.paypalClientId} onChange={(v) => onChange("paypalClientId", v)} />
            <Input label="Secret Key" value={settings.paypalSecretKey} onChange={(v) => onChange("paypalSecretKey", v)} type="password" />
          </div>
        )}
      </div>
    </div>
  );
}

function EmailSettings({ settings, onChange }: { settings: SettingsData; onChange: (k: keyof SettingsData, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="SMTP Host" value={settings.smtpHost} onChange={(v) => onChange("smtpHost", v)} placeholder="smtp.gmail.com" />
        <Input label="SMTP Port" value={settings.smtpPort} onChange={(v) => onChange("smtpPort", v)} placeholder="587" />
        <Input label="SMTP Username" value={settings.smtpUser} onChange={(v) => onChange("smtpUser", v)} />
        <Input label="SMTP Password" value={settings.smtpPassword} onChange={(v) => onChange("smtpPassword", v)} type="password" />
        <Input label="From Email" value={settings.smtpFromEmail} onChange={(v) => onChange("smtpFromEmail", v)} type="email" />
        <Input label="From Name" value={settings.smtpFromName} onChange={(v) => onChange("smtpFromName", v)} />
      </div>
    </div>
  );
}

function NotificationSettings({ settings, onChange }: { settings: SettingsData; onChange: (k: keyof SettingsData, v: any) => void }) {
  return (
    <div>
      <Toggle label="Order Confirmation Emails" desc="Send confirmation to customers after purchase" checked={settings.emailOrderConfirmation} onChange={(v) => onChange("emailOrderConfirmation", v)} />
      <Toggle label="New Order Alerts" desc="Notify admin when new orders are placed" checked={settings.emailNewOrder} onChange={(v) => onChange("emailNewOrder", v)} />
      <Toggle label="Low Stock Alerts" desc="Notify when product stock is low" checked={settings.emailLowStock} onChange={(v) => onChange("emailLowStock", v)} />
      <Toggle label="New Review Notifications" desc="Notify when customers leave reviews" checked={settings.emailNewReview} onChange={(v) => onChange("emailNewReview", v)} />
    </div>
  );
}

function SecuritySettings({ settings, onChange }: { settings: SettingsData; onChange: (k: keyof SettingsData, v: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Change Password Section */}
      <ChangePasswordSection />

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Session Timeout (hours)" value={settings.sessionTimeout} onChange={(v) => onChange("sessionTimeout", v)} />
          <Input label="Max Login Attempts" value={settings.maxLoginAttempts} onChange={(v) => onChange("maxLoginAttempts", v)} />
        </div>
      </div>
      <div className="border-t pt-6">
        <Toggle label="Require Email Verification" desc="New users must verify email before accessing account" checked={settings.requireEmailVerification} onChange={(v) => onChange("requireEmailVerification", v)} />
        <Toggle label="Allow Guest Checkout" desc="Customers can checkout without creating an account" checked={settings.allowGuestCheckout} onChange={(v) => onChange("allowGuestCheckout", v)} />
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChanging(true);
    try {
      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Key className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
          <p className="text-sm text-gray-500">Update your admin account password</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleChangePassword}
            disabled={changing}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
          >
            {changing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            {changing ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuSettings({ settings, onChange }: { settings: SettingsData; onChange: (k: keyof SettingsData, v: any) => void }) {
  const menuItems = settings.menuItems || [];

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: "New Link",
      href: "/",
      enabled: true,
      order: menuItems.length,
    };
    onChange("menuItems", [...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange("menuItems", updated);
  };

  const removeMenuItem = (id: string) => {
    onChange("menuItems", menuItems.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === menuItems.length - 1)) return;
    const newItems = [...menuItems];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    // Update order values
    newItems.forEach((item, i) => (item.order = i));
    onChange("menuItems", newItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Navigation Menu Items</h3>
          <p className="text-sm text-gray-500 mt-1">Add, remove, or reorder menu items that appear in the main navigation</p>
        </div>
        <button
          onClick={addMenuItem}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {menuItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
            No menu items yet. Click "Add Item" to get started.
          </div>
        ) : (
          menuItems
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                {/* Drag Handle / Order Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItem(index, "down")}
                    disabled={index === menuItems.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Label */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateMenuItem(item.id, "label", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Menu label"
                  />
                </div>

                {/* URL */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateMenuItem(item.id, "href", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="/page-url"
                  />
                </div>

                {/* Enabled Toggle */}
                <div className="flex flex-col items-center">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Visible</label>
                  <button
                    onClick={() => updateMenuItem(item.id, "enabled", !item.enabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      item.enabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        item.enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeMenuItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Changes will appear in the main navigation after you save. Menu items marked as hidden will not be visible to customers.
        </p>
      </div>
    </div>
  );
}

