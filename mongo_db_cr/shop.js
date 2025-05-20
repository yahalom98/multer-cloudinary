const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/product-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Connection error:", err));

// Define the Shop Schema
const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Shop name is required"],
    unique: true,
    trim: true,
    minLength: [3, "Shop name must be at least 3 characters long"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["Electronics", "Clothing", "Food", "Books", "Other"],
      message: "{VALUE} is not a valid category"
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  details: {
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [10, "Description must be at least 10 characters long"],
      validate: {
        validator: function(value) {
          return value.length >= 10;
        },
        message: "Description must be at least 10 characters long"
      }
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: "Price must be a positive number"
      }
    },
    discount: {
      type: Number,
      default: 0,
      validate: {
        validator: function(value) {
          return value >= 0 && value <= 100;
        },
        message: "Discount must be between 0 and 100"
      }
    },
    images: {
      type: [String],
      validate: {
        validator: function(value) {
          return value.length >= 2;
        },
        message: "Product must have at least 2 images"
      }
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: "Stock must be a positive number"
      }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add middleware to update the updatedAt field
shopSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add static method to find active products
shopSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Add instance method to calculate final price
shopSchema.methods.calculateFinalPrice = function() {
  return this.details.price * (1 - this.details.discount / 100);
};

// Create the model
const Shop = mongoose.model("Shop", shopSchema);

// Example products
const products = [
  {
    name: "iPhone 13",
    category: "Electronics",
    isActive: true,
    details: {
      description: "Latest iPhone model with amazing camera and performance",
      price: 999,
      discount: 10,
      images: ["iphone1.jpg", "iphone2.jpg"],
      stock: 50,
      rating: 4.5
    }
  },
  {
    name: "Nike Air Max",
    category: "Clothing",
    isActive: true,
    details: {
      description: "Comfortable running shoes with great support",
      price: 129,
      discount: 15,
      images: ["nike1.jpg", "nike2.jpg"],
      stock: 100,
      rating: 4.8
    }
  },
  {
    name: "The Great Gatsby",
    category: "Books",
    isActive: true,
    details: {
      description: "Classic novel by F. Scott Fitzgerald",
      price: 19.99,
      discount: 5,
      images: ["book1.jpg", "book2.jpg"],
      stock: 200,
      rating: 4.7
    }
  }
];

// Function to create products
async function createProducts() {
  try {
    // Clear existing products
    await Shop.deleteMany({});
    
    // Insert new products
    const createdProducts = await Shop.insertMany(products);
    console.log("Products created successfully:", createdProducts);
    
    // Find active products
    const activeProducts = await Shop.findActive();
    console.log("Active products:", activeProducts);
    
    // Calculate final prices
    activeProducts.forEach(product => {
      console.log(`${product.name} final price: $${product.calculateFinalPrice()}`);
    });
    
  } catch (error) {
    console.error("Error creating products:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the function
createProducts(); 