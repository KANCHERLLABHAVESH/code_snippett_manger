import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";

const SnippetFormPage = () => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { isPublic: false },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setError("");
    const payload = {
      ...values,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
      isPublic: Boolean(values.isPublic),
    };
    try {
      const { data } = await api.post("/snippets", payload);
      reset();
      navigate(`/snippets/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save snippet");
    }
  };

  return (
    <section className="stack-lg">
      <h1>New snippet</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <label>
          Title
          <input type="text" required {...register("title")} />
        </label>
        <label>
          Language
          <input type="text" placeholder="javascript" required {...register("language")} />
        </label>
        <label>
          Tags (comma separated)
          <input type="text" placeholder="api,auth" {...register("tags")} />
        </label>
        <label>
          Visibility
          <select {...register("isPublic")}>
            <option value={false}>Private</option>
            <option value={true}>Public</option>
          </select>
        </label>
        <label>
          Code
          <textarea rows="10" required {...register("code")} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary-btn">
          Save snippet
        </button>
      </form>
    </section>
  );
};

export default SnippetFormPage;

