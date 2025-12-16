import Collection from "../models/Collection.js";
import Snippet from "../models/Snippet.js";

export const createCollection = async (req, res, next) => {
  try {
    const { name, description, tags = [], snippets = [] } = req.body;
    const collection = await Collection.create({
      name,
      description,
      tags,
      snippets,
      owner: req.user.id,
    });
    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
};

export const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ owner: req.user.id }).populate(
      "snippets"
    );
    res.json(collections);
  } catch (err) {
    next(err);
  }
};

export const addSnippetToCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const { snippetId } = req.body;

    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (!collection.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not your collection" });
    }

    const snippet = await Snippet.findById(snippetId);
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });

    if (!snippet.isPublic && !snippet.owner.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Cannot add a private snippet you do not own" });
    }

    collection.snippets.addToSet(snippetId);
    await collection.save();
    res.json(collection);
  } catch (err) {
    next(err);
  }
};

export const removeSnippetFromCollection = async (req, res, next) => {
  try {
    const { collectionId, snippetId } = req.params;
    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (!collection.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not your collection" });
    }

    collection.snippets.pull(snippetId);
    await collection.save();
    res.json(collection);
  } catch (err) {
    next(err);
  }
};

