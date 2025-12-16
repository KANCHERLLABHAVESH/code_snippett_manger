import Snippet from "../models/Snippet.js";
import User from "../models/User.js";

export const searchSnippets = async (req, res, next) => {
  try {
    const { q, language, tags, author } = req.query;
    const visibility = req.user
      ? { $or: [{ isPublic: true }, { owner: req.user.id }] }
      : { isPublic: true };

    const query = { ...visibility };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { code: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }
    if (language) {
      query.language = language;
    }
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagList };
    }
    if (author) {
      const user = await User.findOne({
        username: { $regex: author, $options: "i" },
      });
      if (user) query.owner = user._id;
    }

    const snippets = await Snippet.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "username email");
    res.json(snippets);
  } catch (err) {
    next(err);
  }
};

