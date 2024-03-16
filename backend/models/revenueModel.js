import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    totalRevenue: { type: Number },
    monthlyRevenue: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

export default Revenue;
