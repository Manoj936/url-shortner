import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true }, // Short URL identifier
  longUrl: { type: String, required: true, unique: true }, // Original long URL
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 }, // Track URL usage
});

// ✅ Index for Fast Lookup by Short ID
urlSchema.index({ shortId: 1 });

// ✅ Index for Fast Lookup by Long URL
urlSchema.index({ longUrl: 1 });

// ✅ TTL Index: Auto-delete URLs after 1 year (optional)
urlSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

// ✅ Compound Index for Faster Queries (shortId + longUrl)
urlSchema.index({ shortId: 1, longUrl: 1 });

// ✅ Prepare Schema for Sharding (Use Hashed Indexing for Distribution)
urlSchema.index({ shortId: "hashed" });

const URL = mongoose.model("URL", urlSchema);
export default URL;
