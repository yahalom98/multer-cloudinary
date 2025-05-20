# MongoDB and Mongoose Tutorial

## What is MongoDB?
MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. It's designed to scale horizontally and handle large amounts of data.

## What is Mongoose?
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model your application data.

## Installation

```bash
npm init -y
npm install mongoose
```

## Basic Connection

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

## Schema and Model Definition

### Basic Schema Structure
```javascript
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Product = mongoose.model("Product", productSchema);
```

### Advanced Schema with Validation
```javascript
const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  details: {
    description: {
      type: String,
      required: true,
      minLength: [10, "Description must be at least 10 characters"],
      validate: {
        validator: function(value) {
          return value.length >= 10;
        },
        message: "Description must be at least 10 characters long"
      }
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return value >= 0;
        },
        message: "Price must be a positive number"
      }
    },
    discount: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      validate: {
        validator: function(value) {
          return value.length >= 2;
        },
        message: "Product must have at least 2 images"
      }
    }
  }
});
```

## CRUD Operations

### Create (Insert)
```javascript
// Single document
const product = new Product({
  name: "New Product",
  price: 99.99
});

product.save()
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Multiple documents
Product.insertMany([
  { name: "Product 1", price: 100 },
  { name: "Product 2", price: 200 }
])
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Read (Query)
```javascript
// Find all
Product.find()
  .then(products => console.log(products))
  .catch(error => console.error(error));

// Find one
Product.findOne({ name: "Product 1" })
  .then(product => console.log(product))
  .catch(error => console.error(error));

// Find by ID
Product.findById("productId")
  .then(product => console.log(product))
  .catch(error => console.error(error));
```

### Update
```javascript
// Update one
Product.updateOne(
  { name: "Product 1" },
  { $set: { price: 150 } }
)
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Update many
Product.updateMany(
  { category: "Electronics" },
  { $set: { isActive: false } }
)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Delete
```javascript
// Delete one
Product.deleteOne({ name: "Product 1" })
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Delete many
Product.deleteMany({ category: "Electronics" })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Advanced Queries

### Filtering
```javascript
Product.find({
  price: { $gt: 100 },
  isActive: true
})
  .then(products => console.log(products))
  .catch(error => console.error(error));
```

### Sorting
```javascript
Product.find()
  .sort({ price: -1 }) // -1 for descending, 1 for ascending
  .then(products => console.log(products))
  .catch(error => console.error(error));
```

### Pagination
```javascript
Product.find()
  .skip(10) // Skip first 10 documents
  .limit(5) // Limit to 5 documents
  .then(products => console.log(products))
  .catch(error => console.error(error));
```

## Exercises

### Exercise 1: E-commerce Product Management
Create a product management system with the following features:

1. Product Schema:
   - Name (required, unique)
   - Category (required)
   - Price (required, positive number)
   - Stock (required, positive number)
   - Description (required, min 20 characters)
   - Images (array of URLs, min 1 image)
   - Rating (number between 0-5)
   - Reviews (array of review objects)

2. Implement CRUD operations:
   - Create new products
   - Read products with filtering and sorting
   - Update product details
   - Delete products

3. Add validation:
   - Price must be positive
   - Stock must be positive
   - Rating must be between 0-5
   - Description must be at least 20 characters

### Exercise 2: User Management System
Create a user management system with:

1. User Schema:
   - Username (required, unique)
   - Email (required, unique, valid email format)
   - Password (required, min 8 characters)
   - Age (required, between 18-100)
   - Address (object with street, city, country)
   - Orders (array of order references)

2. Order Schema:
   - User (reference to User)
   - Products (array of product references)
   - Total Amount (required, positive)
   - Status (enum: pending, processing, shipped, delivered)
   - Order Date (default to current date)

3. Implement:
   - User registration and login
   - Order creation and management
   - User profile updates
   - Order history

### Exercise 3: Blog System
Create a blog system with:

1. Post Schema:
   - Title (required, unique)
   - Content (required, min 100 characters)
   - Author (reference to User)
   - Tags (array of strings)
   - Comments (array of comment objects)
   - Likes (number, default 0)
   - Published Date (default to current date)

2. Comment Schema:
   - Content (required, min 10 characters)
   - Author (reference to User)
   - Post (reference to Post)
   - Created At (default to current date)

3. Implement:
   - Post creation and editing
   - Comment system
   - Like/unlike functionality
   - Tag-based filtering
   - Author-based filtering

## Best Practices

1. **Schema Design**
   - Use appropriate data types
   - Implement proper validation
   - Use references for relationships
   - Consider indexing frequently queried fields

2. **Error Handling**
   - Use try-catch blocks
   - Implement proper error messages
   - Handle validation errors
   - Log errors appropriately


## Common Issues and Solutions

1. **Connection Issues**
   - Check MongoDB service is running
   - Verify connection string
   - Handle connection errors
   - Implement reconnection logic

2. **Validation Errors**
   - Check required fields
   - Verify data types
   - Handle unique constraint violations
   - Implement custom validation

