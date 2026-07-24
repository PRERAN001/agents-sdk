import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    image: String,

    provider: String,

    providerId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);