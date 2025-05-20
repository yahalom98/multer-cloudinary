const mongoose = require("mongoose");
const Shop = require("./shop");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/product-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Connection error:", err));

// Advanced query functions
async function advancedQueries() {
  try {
    // 1. Find products with price range and sort by rating
    const priceRangeProducts = await Shop.find({
      "details.price": { $gte: 100, $lte: 1000 },
      "details.rating": { $gte: 4 }
    })
    .sort({ "details.rating": -1 })
    .select("name details.price details.rating");

    console.log("\nProducts in price range $100-$1000 with rating >= 4:");
    console.log(priceRangeProducts);

    // 2. Find products by category with pagination
    const page = 1;
    const limit = 2;
    const categoryProducts = await Shop.find({ category: "Electronics" })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name category details");

    console.log("\nElectronics products (page 1):");
    console.log(categoryProducts);

    // 3. Update multiple products with conditions
    const updateResult = await Shop.updateMany(
      { "details.stock": { $lt: 100 } },
      { $set: { "details.stock": 100 } }
    );

    console.log("\nUpdated products with low stock:");
    console.log(updateResult);

    // 4. Aggregate pipeline for category statistics
    const categoryStats = await Shop.aggregate([
      {
        $group: {
          _id: "$category",
          averagePrice: { $avg: "$details.price" },
          totalProducts: { $sum: 1 },
          averageRating: { $avg: "$details.rating" }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]);

    console.log("\nCategory statistics:");
    console.log(categoryStats);

    // 5. Find products with text search
    const searchResults = await Shop.find({
      $or: [
        { name: { $regex: "iphone", $options: "i" } },
        { "details.description": { $regex: "iphone", $options: "i" } }
      ]
    });

    console.log("\nSearch results for 'iphone':");
    console.log(searchResults);

    // 6. Find products with complex conditions
    const complexQuery = await Shop.find({
      $and: [
        { isActive: true },
        { "details.stock": { $gt: 0 } },
        {
          $or: [
            { "details.rating": { $gte: 4.5 } },
            { "details.discount": { $gte: 15 } }
          ]
        }
      ]
    })
    .select("name details.price details.rating details.discount")
    .sort({ "details.rating": -1 });

    console.log("\nComplex query results:");
    console.log(complexQuery);

    // 7. Update with array operations
    const arrayUpdate = await Shop.updateOne(
      { name: "iPhone 13" },
      {
        $push: { "details.images": "iphone3.jpg" },
        $inc: { "details.stock": 10 }
      }
    );

    console.log("\nArray update result:");
    console.log(arrayUpdate);

    // 8. Find products with date range
    const dateRangeProducts = await Shop.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        $lte: new Date()
      }
    });

    console.log("\nProducts created in the last 7 days:");
    console.log(dateRangeProducts);

  } catch (error) {
    console.error("Error in advanced queries:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the advanced queries
advancedQueries(); 