import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true },
    language: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    isPublic: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentSnippet: { type: mongoose.Schema.Types.ObjectId, ref: "Snippet" },
    forks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Snippet = mongoose.model("Snippet", snippetSchema);
export default Snippet;

