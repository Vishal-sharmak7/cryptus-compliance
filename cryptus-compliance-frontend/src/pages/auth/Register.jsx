import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log(res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Registration Successful");

      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration Failed");
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
        className={`relative w-full max-w-5xl h-[650px] overflow-hidden rounded-md border border-white/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-700 ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="grid md:grid-cols-2 h-full">
          {/* LEFT SIDE */}
          <div className="p-12 lg:p-16 bg-white/80 overflow-hidden">
            <button
              onClick={() => navigate("/")}
              className="mb-5 text-2xl cursor-pointer transition-all duration-300 hover:-translate-x-2"
            >
              ←
            </button>

            <h1 className="text-4xl font-bold text-black">Register</h1>

            <p className="text-gray-500 mt-1 text-sm">
              Create your account and start managing compliance with ease.
            </p>

            <form onSubmit={handleRegister} className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label className="font-medium block mb-2">Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-md outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-medium block mb-2">Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="mail@website.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-md outline-none focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-medium block mb-2">Password</label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-md outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full text-white font-semibold bg-[#155DFC] hover:opacity-90 transition"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center mt-6">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex relative items-center justify-center overflow-hidden bg-[#155DFC]">
            <div className="absolute w-96 h-96 bg-white/20 blur-[120px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 text-center text-white max-w-md px-8">
              <h2 className="text-5xl font-bold leading-tight">
                Join the future
                <br />
                of compliance.
              </h2>

              <p className="mt-6 text-lg text-white/90">
                Streamline audits, manage risks, and stay compliant across all
                frameworks from one platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
