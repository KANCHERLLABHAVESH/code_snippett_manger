import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    const res = await login(values.email, values.password);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <section className="auth-card">
      <h1>Welcome back</h1>
      <p className="muted">Log in to manage your snippets</p>
      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <label>
          Email
          <input type="email" required {...register("email")} />
        </label>
        <label>
          Password
          <input type="password" required {...register("password")} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="muted">
        No account? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
};

export default LoginPage;

