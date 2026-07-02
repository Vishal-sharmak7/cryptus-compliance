import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleChange = (e) => {
    setError(""); // clear error on input change
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await authService.login(form);

      // Await login so user state is fully set before navigating
      await login(res.data.token);
      toast.success("Login Successful");

      // Redirect to the originally requested page, or default to dashboard
      const from = location.state?.from?.pathname || "/app/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid email or password. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden px-4">
      {/* Background Blur */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/30 blur-[150px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/30 blur-[150px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-indigo-300/20 blur-[180px] rounded-full" />

      {/* Main Card */}
      <div
        className={`relative w-full max-w-5xl h-[600px] overflow-hidden rounded-[5px] border border-white/40  backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-700 ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="grid md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="p-12 lg:p-16 bg-white/80">
            <button
              onClick={() => navigate("/")}
              className="mb-5 text-2xl cursor-pointer transition-all duration-300 hover:-translate-x-2"
            >
              ←
            </button>

            <h1 className="text-4xl font-bold text-black">Login</h1>

            <p className="text-gray-500 mt-1 text-sm">
              See your growth and get consulting support!
            </p>

            <form onSubmit={handleLogin} className="mt-5 space-y-8">
              <div>
                <label className="font-medium block mb-3">Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="mail@website.com"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-md outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-medium block mb-3">Password</label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className={`w-full px-4 py-3 rounded-2xl border bg-white/70 backdrop-blur-md outline-none focus:border-blue-500 ${
                    error ? "border-red-400 focus:border-red-500" : "border-gray-300"
                  }`}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full text-white font-semibold bg-[#155DFC] hover:opacity-90 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium cursor-pointer"
              >
                Register
              </Link>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex relative items-center justify-center overflow-hidden bg-[#155DFC]">
            {/* Glow */}
            <div className="absolute w-96 h-96 bg-white/20 blur-[120px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-md px-8">
              <h2 className="text-6xl font-bold leading-tight">
                Turn your ideas
                <br />
                into reality.
              </h2>

              <p className="mt-6 text-xl text-white/90">
                Consistent quality and experience across all platforms and
                devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
