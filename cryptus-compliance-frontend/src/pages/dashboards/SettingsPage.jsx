import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service";
import { User, Key, Building2, ShieldCheck, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, login: updateAuthUser } = useAuth(); // useAuth provides a method or we can just fetch profile

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      return toast.error("Name and email are required");
    }

    setIsProfileSaving(true);
    try {
      await authService.updateProfile(profileForm);
      toast.success("Profile updated successfully");
      
      // Attempt to refresh profile details in AuthContext
      const profileResp = await authService.getProfile();
      const updatedUser = profileResp.data?.user || profileResp.data;
      if (updatedUser) {
        // If AuthContext has a local storage token sync, it will keep it updated
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          // Refresh page or trigger context re-render if supported
          window.dispatchEvent(new Event("storage"));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long");
    }

    setIsPasswordSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your profile information and account security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Account Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl mb-4 border border-indigo-100">
            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : <User size={32} />}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 justify-center">
            <Mail size={14} className="text-slate-400" /> {user?.email}
          </p>

          <div className="w-full border-t border-slate-100 my-5 pt-5 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Role</span>
              <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full uppercase">
                {user?.role?.replace("_", " ")}
              </span>
            </div>
            {user?.company_name && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold uppercase">Organization</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 size={12} className="text-slate-400" /> {user.company_name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Forms: Profile & Password */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <User size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800">Profile Details</h3>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm shadow-sm"
                >
                  {isProfileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <Key size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800">Security Credentials</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPasswordSaving}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm shadow-sm"
                >
                  {isPasswordSaving ? "Updating Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
