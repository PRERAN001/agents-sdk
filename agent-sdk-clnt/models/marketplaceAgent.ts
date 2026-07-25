import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMarketplaceAgent extends Document {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  stars: number;
  clones: number;
  author: string;
  version: string;
  systemPrompt: string;
  requiredTools: string[];
  cliCommand: string;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceAgentSchema = new Schema<IMarketplaceAgent>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: [String],
    stars: { type: Number, default: 42 },
    clones: { type: Number, default: 128 },
    author: { type: String, default: "DeployGent Engineering" },
    version: { type: String, default: "2.5.0" },
    systemPrompt: String,
    requiredTools: [String],
    cliCommand: String,
  },
  {
    timestamps: true,
  }
);

const MarketplaceAgent: Model<IMarketplaceAgent> =
  mongoose.models.MarketplaceAgent ||
  mongoose.model<IMarketplaceAgent>("MarketplaceAgent", MarketplaceAgentSchema);

export default MarketplaceAgent;
