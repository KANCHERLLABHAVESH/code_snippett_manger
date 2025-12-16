import { VM } from "vm2";
import Snippet from "../models/Snippet.js";

const buildVisibilityQuery = (user) => {
  if (!user) return { isPublic: true };
  return { $or: [{ isPublic: true }, { owner: user.id }] };
};

export const listSnippets = async (req, res, next) => {
  try {
    const { language, tags } = req.query;
    const query = buildVisibilityQuery(req.user);

    if (language) {
      query.language = language;
    }
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagList };
    }

    const snippets = await Snippet.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "username email");
    res.json(snippets);
  } catch (err) {
    next(err);
  }
};

export const getSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate(
      "owner",
      "username email"
    );
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    const isOwner = req.user && snippet.owner._id.equals(req.user.id);
    if (!snippet.isPublic && !isOwner) {
      return res.status(403).json({ message: "Private snippet" });
    }

    res.json(snippet);
  } catch (err) {
    next(err);
  }
};

export const createSnippet = async (req, res, next) => {
  try {
    const { title, code, language, tags = [], isPublic = false } = req.body;
    const snippet = await Snippet.create({
      title,
      code,
      language,
      tags,
      isPublic,
      owner: req.user.id,
    });
    res.status(201).json(snippet);
  } catch (err) {
    next(err);
  }
};

export const updateSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) return res.status(404).json({ message: "Not found" });
    if (!snippet.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not your snippet" });
    }

    const { title, code, language, tags, isPublic } = req.body;
    if (title !== undefined) snippet.title = title;
    if (code !== undefined) snippet.code = code;
    if (language !== undefined) snippet.language = language;
    if (tags !== undefined) snippet.tags = tags;
    if (isPublic !== undefined) snippet.isPublic = isPublic;

    const saved = await snippet.save();
    res.json(saved);
  } catch (err) {
    next(err);
  }
};

export const deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) return res.status(404).json({ message: "Not found" });
    if (!snippet.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not your snippet" });
    }

    await snippet.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

export const forkSnippet = async (req, res, next) => {
  try {
    const base = await Snippet.findById(req.params.id);
    if (!base) return res.status(404).json({ message: "Not found" });

    const isOwner = base.owner.equals(req.user.id);
    if (!base.isPublic && !isOwner) {
      return res.status(403).json({ message: "Private snippet" });
    }

    const fork = await Snippet.create({
      title: `${base.title} (fork)`,
      code: base.code,
      language: base.language,
      tags: base.tags,
      isPublic: false,
      owner: req.user.id,
      parentSnippet: base._id,
    });

    base.forks += 1;
    await base.save();

    res.status(201).json(fork);
  } catch (err) {
    next(err);
  }
};

export const previewSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) return res.status(404).json({ message: "Not found" });

    if (snippet.language.toLowerCase() !== "javascript") {
      return res
        .status(400)
        .json({ message: "Preview supported only for JavaScript" });
    }

    const logs = [];
    const vm = new VM({
      timeout: 1000,
      sandbox: {
        console: {
          log: (...args) => logs.push(args.join(" ")),
        },
      },
    });

    let result;
    try {
      result = vm.run(snippet.code);
    } catch (err) {
      return res.status(400).json({ message: "Execution error", error: err.message });
    }

    res.json({ result, logs });
  } catch (err) {
    next(err);
  }
};

