import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/client.js";

const CollectionsPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState("");

  const loadCollections = async () => {
    try {
      const { data } = await api.get("/collections");
      setCollections(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load collections");
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const onSubmit = async (values) => {
    try {
      await api.post("/collections", values);
      reset();
      loadCollections();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create collection");
    }
  };

  return (
    <section className="stack-lg">
      <h1>Collections</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="stack card">
        <label>
          Name
          <input type="text" required {...register("name")} />
        </label>
        <label>
          Description
          <textarea rows="3" {...register("description")} />
        </label>
        <button type="submit" className="primary-btn">
          Create collection
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <div className="grid">
        {collections.map((col) => (
          <article key={col._id} className="card">
            <h3>{col.name}</h3>
            <p className="muted">{col.description || "No description"}</p>
            <p className="muted">{col.snippets?.length || 0} snippets</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CollectionsPage;

