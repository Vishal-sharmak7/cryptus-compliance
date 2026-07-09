import { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiBriefcase, FiX, FiEdit2, FiSave, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { authService } from "../services/auth.service";

/* ── Tiny field component ─────────────────────────────────── */
function Field({ icon: Icon, label, type = "text", value, onChange, placeholder, disabled, rightElement }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={11} />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 outline-none
            ${disabled
              ? "bg-slate-50 border-slate-200 text-slate-500 cursor-default"
              : "bg-white border-slate-200 text-slate-800 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            } ${rightElement ? "pr-11" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePanel({ open, onClose, user, onSave }) {
  const [editing, setEditing]         = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [saving, setSaving]           = useState(false);
  const [savedMsg, setSavedMsg]       = useState(false);
  const [error, setError]             = useState("");

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
  });

  // Sync form whenever user data or panel open state changes
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "", password: "" });
    }
  }, [user, open]);

  // Reset editing state when panel closes
  useEffect(() => {
    if (!open) {
      setEditing(false);
      setError("");
      setSavedMsg(false);
      setShowPass(false);
    }
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), email: form.email.trim() };
      if (form.password.trim()) payload.password = form.password.trim();

      const res = await authService.updateProfile(payload);
      // Update token in localStorage so subsequent requests use the new one
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (onSave) onSave(res.data.user);
      setEditing(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    setForm({ name: user?.name || "", email: user?.email || "", password: "" });
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Slide-in Panel ── */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col
          bg-white/90 backdrop-blur-2xl border-l border-white/60 shadow-2xl shadow-indigo-100/50
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Panel Header ── */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-blue-50/40 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1,#155DFC)" }}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">My Profile</h2>
              <p className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase()?.replace("_", " ") || "user"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150"
            aria-label="Close panel"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* ── Success Banner ── */}
        {savedMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium animate-fade-up">
            <FiCheck size={15} className="shrink-0" />
            Profile updated successfully!
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-fade-up">
            {error}
          </div>
        )}

        {/* ── Form Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Name */}
          <Field
            icon={FiUser}
            label="Full Name"
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            disabled={!editing}
          />

          {/* Email */}
          <Field
            icon={FiMail}
            label="Email Address"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            disabled={!editing}
          />

          {/* Password — only shown in edit mode */}
          {editing && (
            <Field
              icon={FiLock}
              label="New Password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Leave blank to keep current password"
              disabled={false}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              }
            />
          )}

          {/* Company Name — read-only */}
          <Field
            icon={FiBriefcase}
            label="Company"
            value={user?.company_name || "—"}
            onChange={() => {}}
            placeholder="No company linked"
            disabled={true}
          />

          {/* Role — read-only badge */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FiUser size={11} />
              Role
            </label>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-sm font-semibold text-indigo-700">
                {user?.role?.replace("_", " ") || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Panel Footer / Actions ── */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-300/40"
                style={{ background: "linear-gradient(135deg,#6366f1,#155DFC)" }}
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FiSave size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90 shadow-lg shadow-indigo-300/40"
              style={{ background: "linear-gradient(135deg,#6366f1,#155DFC)" }}
            >
              <FiEdit2 size={14} />
              Edit Profile
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
