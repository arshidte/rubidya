import mongoose from "mongoose";

const levelSchema = new mongoose.Schema(
  {
    levelPercentages: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Level = mongoose.model("Level", levelSchema);

export default Level;
