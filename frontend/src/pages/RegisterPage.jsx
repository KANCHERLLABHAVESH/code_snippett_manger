import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    const res = await registerUser(values.username, values.email, values.password);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Save, search and share your code snippets.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <label>
          Username
          <input type="text" required {...register("username")} />
        </label>
        <label>
          Email
          <input type="email" required {...register("email")} />
        </label>
        <label>
          Password
          <input type="password" required minLength={6} {...register("password")} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};

export default RegisterPage;

