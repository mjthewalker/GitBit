const { Router } = require("express");
const mongoose = require("mongoose");


const router = Router();

const Portfolio = require("../models/portfolio"); // Import the Portfolio model


// // POST route to add portfolio data
// router.post("/add", async (req, res) => {
//   try {
//     const { userId, totalValue, investments, transactions, riskProfile } = req.body;

//     // Create a new Portfolio document
//     const newPortfolio = new Portfolio({
//       userId,
//       totalValue,
//       investments,
//       transactions,
//       riskProfile,
//       lastUpdated: new Date()
//     });

//     // Save to database
//     await newPortfolio.save();

//     res.status(201).json({
//       success: true,
//       message: "Portfolio data added successfully",
//       portfolio: newPortfolio
//     });
//   } catch (error) {
//     console.error("Error adding portfolio data:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to add portfolio data",
//       error: error.message
//     });
//   }
// });

// module.exports = router;

router.post("/add", async (req, res) => {
    try {
      const { transactionType, assetName, assetType, amount, quantity, transactionDate } = req.body;
      
      // Temporary: Get the first portfolio in the database
      // In production, this should use proper authentication
      const portfolio = await Portfolio.findOne();
      
      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: "Portfolio not found. Please create a portfolio first."
        });
      }
  
      // Create new transaction object
      const newTransaction = {
        transactionType,
        assetName,
        assetType,
        amount: parseFloat(amount),
        quantity: parseFloat(quantity),
        transactionDate: new Date(transactionDate)
      };
  
      // Add transaction to transactions array
      portfolio.transactions.push(newTransaction);
  
      // Update investments based on transaction
      let investment = portfolio.investments.find(inv => 
        inv.assetName === assetName && inv.assetType === assetType
      );
  
      if (transactionType === 'Buy') {
        if (investment) {
          // Update existing investment
          investment.amountInvested += parseFloat(amount);
          investment.quantity += parseFloat(quantity);
          investment.currentValue += parseFloat(amount); // For simplicity, using amount as current value
        } else {
          // Create new investment
          portfolio.investments.push({
            assetName,
            assetType,
            amountInvested: parseFloat(amount),
            currentValue: parseFloat(amount), // For simplicity, using amount as current value
            quantity: parseFloat(quantity),
            purchaseDate: new Date(transactionDate)
          });
        }
      } else if (transactionType === 'Sell') {
        if (!investment) {
          return res.status(400).json({
            success: false,
            message: "Cannot sell asset that is not in portfolio"
          });
        }
  
        if (investment.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: "Insufficient quantity to sell"
          });
        }
  
        // Update investment after sell
        investment.quantity -= parseFloat(quantity);
        investment.currentValue -= parseFloat(amount);
        
        // Remove investment if quantity becomes 0
        if (investment.quantity === 0) {
          portfolio.investments = portfolio.investments.filter(inv => 
            inv.assetName !== assetName || inv.assetType !== assetType
          );
        }
      }
  
      // Update total value
      portfolio.totalValue = portfolio.investments.reduce(
        (total, inv) => total + inv.currentValue, 
        0
      );
  
      // Update lastUpdated timestamp
      portfolio.lastUpdated = new Date();
  
      // Save changes
      await portfolio.save();
  
      res.status(200).json({
        success: true,
        message: "Transaction added successfully",
        portfolio
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add transaction",
        error: error.message
      });
    }
  });

// GET request to retrieve portfolio by userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the portfolio for the given userId
    const portfolio = await Portfolio.findOne({ userId: userId });

    // If no portfolio found for the user
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found for this user" });
    }

    // Send back the portfolio data
    res.status(200).json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;



