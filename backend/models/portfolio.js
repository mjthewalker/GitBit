const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there's a User model
      required: true,
    },
    totalValue: {
      type: Number,
      required: true,
      default: 0, // Initial portfolio value
    },
    investments: [
      {
        assetName: {
          type: String, // Name of the investment (e.g., stock, real estate, etc.)
          required: true,
        },
        assetType: {
          type: String, // e.g., "Stock", "Crypto", "Real Estate", etc.
          required: true,
        },
        amountInvested: {
          type: Number, // Amount invested in this asset
          required: true,
        },
        currentValue: {
          type: Number, // Current market value of the asset
          required: true,
        },
        quantity: {
          type: Number, // Number of units/shares owned
          required: true,
        },
        purchaseDate: {
          type: Date, // Date of purchase
          required: true,
        },
      },
    ],
    transactions: [
      {
        transactionType: {
          type: String, // "Buy" or "Sell"
          required: true,
        },
        assetName: {
          type: String,
          required: true,
        },
        assetType: {
          type: String, // e.g., "Stock", "Crypto", etc.
          required: true,
        },
        amount: {
          type: Number, // Amount of money involved in the transaction
          required: true,
        },
        quantity: {
          type: Number, // Quantity of the asset bought/sold
          required: true,
        },
        transactionDate: {
          type: Date,
          required: true,
        },
      },
    ],
    riskProfile: {
      type: String, // e.g., "Low", "Medium", "High"
      default: "Medium",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;