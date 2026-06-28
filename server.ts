/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// -------------------------------------------------------------
// Lazy Gemini Client Initialization
// -------------------------------------------------------------
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// In-Memory Database (Initialized with high-quality default data)
// -------------------------------------------------------------
let sellers = [
  {
    id: "seller_1",
    shopName: "Artisan Woodworks",
    ownerName: "Marcus Vance",
    rating: 4.8,
    badges: ["Top Rated", "Verified Seller"],
    isVerified: true,
    verificationStatus: "verified",
    revenue: 42500,
    salesCount: 310,
    analytics: {
      salesHeatmap: [
        { day: "Mon", hour: "12:00", sales: 15 },
        { day: "Wed", hour: "18:00", sales: 24 },
        { day: "Fri", hour: "20:00", sales: 38 },
        { day: "Sat", hour: "14:00", sales: 45 },
        { day: "Sun", hour: "16:00", sales: 49 }
      ],
      reorderAlerts: [
        { productId: "prod_wood_lamp", title: "Handcrafted Maple Lamp", currentStock: 3, suggestedReorder: 10 }
      ],
      revenueForecast: [
        { date: "06-28", amount: 1500 },
        { date: "07-05", amount: 1850 },
        { date: "07-12", amount: 2200 },
        { date: "07-19", amount: 2500 },
        { date: "07-26", amount: 2900 }
      ]
    }
  },
  {
    id: "seller_2",
    shopName: "Urban Threads Co.",
    ownerName: "Sarah Jenkins",
    rating: 4.6,
    badges: ["Fast Shipper", "New Arrival", "Verified Seller"],
    isVerified: true,
    verificationStatus: "verified",
    revenue: 18200,
    salesCount: 140,
    analytics: {
      salesHeatmap: [
        { day: "Tue", hour: "10:00", sales: 12 },
        { day: "Thu", hour: "15:00", sales: 18 },
        { day: "Sat", hour: "11:00", sales: 30 },
        { day: "Sun", hour: "19:00", sales: 35 }
      ],
      reorderAlerts: [
        { productId: "prod_denim_jacket", title: "Vintage Wash Denim Jacket", currentStock: 2, suggestedReorder: 15 }
      ],
      revenueForecast: [
        { date: "06-28", amount: 800 },
        { date: "07-05", amount: 950 },
        { date: "07-12", amount: 1100 },
        { date: "07-19", amount: 1300 },
        { date: "07-26", amount: 1600 }
      ]
    }
  },
  {
    id: "seller_3",
    shopName: "Retro Electro",
    ownerName: "Niko Tesla",
    rating: 4.2,
    badges: [],
    isVerified: false,
    verificationStatus: "pending",
    verificationDocUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop",
    revenue: 5600,
    salesCount: 42,
    analytics: {
      salesHeatmap: [
        { day: "Mon", hour: "09:00", sales: 3 },
        { day: "Fri", hour: "17:00", sales: 14 },
        { day: "Sat", hour: "19:00", sales: 22 }
      ],
      reorderAlerts: [],
      revenueForecast: [
        { date: "06-28", amount: 300 },
        { date: "07-05", amount: 350 },
        { date: "07-12", amount: 480 },
        { date: "07-19", amount: 600 },
        { date: "07-26", amount: 750 }
      ]
    }
  }
];

let products: any[] = [
  {
    id: "prod_wood_lamp",
    title: "Handcrafted Maple Lamp",
    description: "Bring the elegance of nature indoors with this stunning maple wood lamp. Expertly turned on a lathe and finished with eco-friendly organic oil, its beautiful grain glows warmly when lit. Perfect for minimalists, designers, and wood lovers alike.",
    price: 120,
    originalPrice: 150,
    stock: 3,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    category: "Home & Living",
    tags: ["handmade", "lamp", "wood", "lighting", "minimalist"],
    sellerId: "seller_1",
    rating: 4.9,
    reviewsCount: 3,
    competitorPrice: 135
  },
  {
    id: "prod_denim_jacket",
    title: "Vintage Wash Denim Jacket",
    description: "Classic rugged styling meets modern comfort. This denim jacket is crafted from premium 100% heavy cotton denim, washed multiple times to achieve that perfect retro lived-in look and ultra-soft finish. Complete with durable copper button fasteners.",
    price: 85,
    originalPrice: 99,
    stock: 2,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    category: "Apparel",
    tags: ["vintage", "denim", "jacket", "streetwear", "unisex"],
    sellerId: "seller_2",
    rating: 4.5,
    reviewsCount: 2,
    competitorPrice: 79
  },
  {
    id: "prod_retro_keyboard",
    title: "Mechanical Retro Keyboard",
    description: "Type with supreme satisfaction. Featuring tactile clicky blue switches, customizable pastel round keycaps reminiscent of classic typewriters, and multi-mode mechanical feedback. Compatible with Windows, Mac, iOS, and Android.",
    price: 95,
    originalPrice: 120,
    stock: 12,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    category: "Electronics",
    tags: ["keyboard", "mechanical", "retro", "office", "gaming"],
    sellerId: "seller_3",
    rating: 4.0,
    reviewsCount: 1,
    competitorPrice: 110
  }
];

let auctions: any[] = [
  {
    id: "auc_vintage_watch",
    productId: "prod_vintage_watch",
    title: "1970s Seamaster Automatic",
    description: "An authentic, pristine 1970s Seamaster gold plated mechanical wristwatch. Fully serviced, keeps accurate time, and features a classic rich leather band. Vintage collectors only.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
    startingPrice: 350,
    currentBid: 420,
    minIncrement: 15,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    sellerId: "seller_1",
    highBidder: "Alex G.",
    bidsCount: 5,
    status: "active" as const
  }
];

let reviews: any[] = [
  {
    id: "rev_1",
    productId: "prod_wood_lamp",
    userName: "Emma Watson",
    rating: 5,
    comment: "This lamp is absolutely gorgeous! The warm glow matches my desk setup perfectly. Premium quality craftsmanship.",
    date: "2026-06-25",
    isSuspicious: false,
    suspicionReason: ""
  },
  {
    id: "rev_2",
    productId: "prod_wood_lamp",
    userName: "John Doe",
    rating: 5,
    comment: "Awesome seller, super fast shipping! The maple has beautiful grain structures.",
    date: "2026-06-26",
    isSuspicious: false,
    suspicionReason: ""
  },
  {
    id: "rev_3",
    productId: "prod_denim_jacket",
    userName: "Alice Cooper",
    rating: 4,
    comment: "Great retro fit, feels very rugged and durable. It is slightly heavier than expected but looks incredibly neat.",
    date: "2026-06-20",
    isSuspicious: false,
    suspicionReason: ""
  },
  {
    id: "rev_bot_1",
    productId: "prod_retro_keyboard",
    userName: "Buyer99281",
    rating: 5,
    comment: "AMAZING PRODUCT! WOW AMAZING BEST QUALITY IN WORLD CHEAP EXCELLENT BUY NOW! AMAZING PRODUCT! WOW AMAZING BEST QUALITY IN WORLD CHEAP EXCELLENT BUY NOW!",
    date: "2026-06-27",
    isSuspicious: true,
    suspicionReason: "Highly repetitive text with excessive capitalization and spam-like buy-now signals."
  }
];

let orders: any[] = [
  {
    id: "ORD-9831",
    buyerName: "kiruthikaganeshkiruthika@gmail.com",
    deliveryAddress: {
      street: "123 Innovation Drive, Silicon Valley",
      city: "Sunnyvale",
      pincode: "94086"
    },
    items: [
      {
        productId: "prod_wood_lamp",
        title: "Handcrafted Maple Lamp",
        price: 120,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&auto=format&fit=crop&q=80"
      }
    ],
    totalAmount: 120,
    loyaltyPointsEarned: 120,
    status: "Shipped" as const,
    createdAt: "2026-06-26T14:30:00Z",
    trackingTimeline: [
      { status: "Ordered", time: "Jun 26, 2:30 PM", description: "Order successfully placed." },
      { status: "Packed", time: "Jun 26, 5:45 PM", description: "Packed carefully at vendor studio." },
      { status: "Shipped", time: "Jun 27, 9:00 AM", description: "In transit via local high-speed express." }
    ],
    qrCodeData: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORD-9831"
  }
];

let disputes: any[] = [
  {
    id: "DIS-001",
    orderId: "ORD-9831",
    buyerName: "kiruthikaganeshkiruthika@gmail.com",
    sellerId: "seller_1",
    reason: "Damaged Delivery Packaging",
    details: "The package carton arrived heavily crushed on one side. Luckily, the lamp is mostly fine but the lightbulb was broken.",
    status: "pending" as const,
    createdAt: "2026-06-27T08:15:00Z"
  }
];

let liveStreams = [
  {
    id: "live_1",
    sellerId: "seller_1",
    shopName: "Artisan Woodworks",
    title: "Lathe Turning live - Crafting Custom Walnut Bowls!",
    viewerCount: 142,
    isActive: true,
    streamUrl: "https://assets.mixkit.co/videos/preview/mixkit-carpenter-shaping-wood-with-chisel-on-lathe-40348-large.mp4",
    featuredProductId: "prod_wood_lamp",
    messages: [
      { userName: "Clara S.", text: "Wow, the wood chips are flying!", time: "9:45 AM" },
      { userName: "Devon R.", text: "Do you sell those custom bowls?", time: "9:46 AM" },
      { userName: "Marcus Vance", text: "Yes! Listing them right after this stream ends.", time: "9:47 AM" }
    ]
  }
];

// -------------------------------------------------------------
// Core E-Commerce API Endpoints
// -------------------------------------------------------------

// Products
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { title, description, price, stock, category, tags, sellerId, image } = req.body;
  const newProduct = {
    id: "prod_" + Math.random().toString(36).substr(2, 9),
    title: title || "Unnamed Product",
    description: description || "No description provided.",
    price: Number(price) || 10,
    stock: Number(stock) || 0,
    image: image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    category: category || "General",
    tags: Array.isArray(tags) ? tags : String(tags || "").split(",").map(t => t.trim()).filter(Boolean),
    sellerId: sellerId || "seller_1",
    rating: 5.0,
    reviewsCount: 0,
    competitorPrice: Math.round(Number(price) * (0.8 + Math.random() * 0.4))
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// CSV / Bulk Upload Simulation
app.post("/api/products/bulk", (req, res) => {
  const { csvText, sellerId } = req.body;
  if (!csvText) {
    return res.status(400).json({ error: "CSV data is required." });
  }

  try {
    const lines = csvText.split("\n").filter((l: string) => l.trim());
    if (lines.length < 2) {
      return res.status(400).json({ error: "Invalid CSV. Must contain headers and at least one row." });
    }

    const headers = lines[0].split(",").map((h: string) => h.trim().toLowerCase());
    const uploadedProducts: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v: string) => v.trim());
      const row: any = {};
      headers.forEach((h: string, index: number) => {
        row[h] = values[index] || "";
      });

      const newProduct = {
        id: "prod_" + Math.random().toString(36).substr(2, 9),
        title: row.title || `Bulk Item #${i}`,
        description: row.description || "Uploaded in bulk.",
        price: Number(row.price) || 49,
        stock: Number(row.stock) || 10,
        image: row.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
        category: row.category || "General",
        tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()) : ["bulk"],
        sellerId: sellerId || "seller_1",
        rating: 4.8,
        reviewsCount: 0,
        competitorPrice: Math.round((Number(row.price) || 49) * 0.9)
      };
      products.unshift(newProduct);
      uploadedProducts.push(newProduct);
    }

    res.json({ success: true, count: uploadedProducts.length, products: uploadedProducts });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to parse CSV. Make sure fields are comma-separated." });
  }
});

// Reviews & Fake Review Detector API
app.get("/api/products/:id/reviews", (req, res) => {
  const filteredReviews = reviews.filter(r => r.productId === req.params.id);
  res.json(filteredReviews);
});

app.post("/api/products/:id/reviews", async (req, res) => {
  const { rating, comment, userName } = req.body;
  const productId = req.params.id;

  let isSuspicious = false;
  let suspicionReason = "";

  // Perform AI Auditing if Gemini is available
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are an expert Fake Review Detector for a Multi-Vendor E-Commerce platform.
Analyze this review left by user "${userName}" for product "${productId}":
Rating given: ${rating}/5 stars.
Review text: "${comment}".

Determine if this is suspiciously bot-generated, spam-like, excessively repetitive, or a fake positive/negative brigade.
Return JSON response ONLY:
{
  "isSuspicious": boolean,
  "suspicionReason": "Write a concise explanation why it is flagged or empty if safe"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const auditData = JSON.parse(response.text.trim());
      isSuspicious = auditData.isSuspicious;
      suspicionReason = auditData.suspicionReason;
    } catch (e) {
      console.error("Gemini Review Audit Error, using offline fallback:", e);
      // Fallback
      if (comment.toUpperCase().includes("AMAZING") && comment.length > 80 && comment.split("!").length > 5) {
        isSuspicious = true;
        suspicionReason = "Offline Rule: Repetitive keywords and hyperactive punctuation indicative of bot behavior.";
      }
    }
  } else {
    // Offline heuristic
    if (comment.toUpperCase().includes("AMAZING") && comment.length > 80 && comment.split("!").length > 5) {
      isSuspicious = true;
      suspicionReason = "Heuristic check: Review text contains high density of uppercase exclamation phrases and repetitive patterns.";
    }
  }

  const newReview = {
    id: "rev_" + Math.random().toString(36).substr(2, 9),
    productId,
    userName: userName || "Anonymous Buyer",
    rating: Number(rating) || 5,
    comment: comment || "",
    date: new Date().toISOString().split("T")[0],
    isSuspicious,
    suspicionReason
  };

  reviews.push(newReview);

  // Update product overall stats
  const prod = products.find(p => p.id === productId);
  if (prod) {
    const productReviews = reviews.filter(r => r.productId === productId);
    const sum = productReviews.reduce((acc, curr) => acc + curr.rating, 0);
    prod.reviewsCount = productReviews.length;
    prod.rating = parseFloat((sum / productReviews.length).toFixed(1));
  }

  res.status(201).json(newReview);
});

// Sellers
app.get("/api/sellers", (req, res) => {
  res.json(sellers);
});

// Seller verification submission
app.post("/api/sellers/verify", (req, res) => {
  const { sellerId, idPhotoBase64 } = req.body;
  const seller = sellers.find(s => s.id === sellerId);
  if (!seller) {
    return res.status(404).json({ error: "Seller not found" });
  }

  seller.verificationStatus = "pending";
  seller.verificationDocUrl = idPhotoBase64 || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop";
  res.json({ success: true, seller });
});

// Admin approves seller verification
app.post("/api/admin/verify-approve", (req, res) => {
  const { sellerId, approve, rejectionNotes } = req.body;
  const seller = sellers.find(s => s.id === sellerId);
  if (!seller) {
    return res.status(404).json({ error: "Seller not found" });
  }

  if (approve) {
    seller.verificationStatus = "verified";
    seller.isVerified = true;
    if (!seller.badges.includes("Verified Seller")) {
      seller.badges.push("Verified Seller");
    }
  } else {
    seller.verificationStatus = "rejected";
    seller.isVerified = false;
    seller.badges = seller.badges.filter(b => b !== "Verified Seller");
  }

  res.json({ success: true, seller });
});

// Auctions
app.get("/api/auctions", (req, res) => {
  res.json(auctions);
});

app.post("/api/auctions", (req, res) => {
  const { title, description, startingPrice, minIncrement, durationHours, sellerId, image } = req.body;
  const newAuction = {
    id: "auc_" + Math.random().toString(36).substr(2, 9),
    productId: "prod_auc_" + Math.random().toString(36).substr(2, 9),
    title: title || "Collector Item",
    description: description || "Vintage / limited run handmade item.",
    image: image || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop",
    startingPrice: Number(startingPrice) || 100,
    currentBid: Number(startingPrice) || 100,
    minIncrement: Number(minIncrement) || 10,
    endTime: new Date(Date.now() + (Number(durationHours) || 24) * 60 * 60 * 1000).toISOString(),
    sellerId: sellerId || "seller_1",
    highBidder: null,
    bidsCount: 0,
    status: "active" as const
  };
  auctions.unshift(newAuction);
  res.status(201).json(newAuction);
});

app.post("/api/auctions/bid", (req, res) => {
  const { auctionId, bidderName, bidAmount } = req.body;
  const auction = auctions.find(a => a.id === auctionId);
  if (!auction) {
    return res.status(404).json({ error: "Auction not found" });
  }

  if (new Date() > new Date(auction.endTime)) {
    auction.status = "ended";
    return res.status(400).json({ error: "Auction has already ended." });
  }

  const minRequired = auction.currentBid + auction.minIncrement;
  if (Number(bidAmount) < minRequired) {
    return res.status(400).json({ error: `Bid is too low. Minimum required bid is $${minRequired}.` });
  }

  auction.currentBid = Number(bidAmount);
  auction.highBidder = bidderName || "Anonymous Bidder";
  auction.bidsCount += 1;

  res.json({ success: true, auction });
});

// Orders & Logistics
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { buyerName, items, totalAmount, deliveryAddress } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  // Calculate delivery date estimate based on Pin code
  // Let's create a cool hyper-local estimate calculation
  const pincode = deliveryAddress?.pincode || "94086";
  let daysEstimate = 3;
  if (pincode.startsWith("90") || pincode.startsWith("94")) {
    daysEstimate = 1; // Hyper-local same day / next day
  } else if (pincode.startsWith("1") || pincode.startsWith("2")) {
    daysEstimate = 4; // Standard cross-country
  } else {
    daysEstimate = 2; // Regional
  }

  const deliveryDateStr = new Date(Date.now() + daysEstimate * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
  const loyaltyPointsEarned = Math.round(totalAmount);

  // Add order to database
  const newOrder = {
    id: orderId,
    buyerName: buyerName || "kiruthikaganeshkiruthika@gmail.com",
    deliveryAddress: deliveryAddress || { street: "123 Main St", city: "Metro", pincode: "94086" },
    items,
    totalAmount,
    loyaltyPointsEarned,
    status: "Packed" as const,
    createdAt: new Date().toISOString(),
    trackingTimeline: [
      { status: "Ordered", time: "Just Now", description: "Your order is confirmed." },
      { status: "Packed", time: "Processing", description: `Shipper preparing package. Estimated delivery on ${deliveryDateStr}.` }
    ],
    qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderId}`
  };

  orders.unshift(newOrder);

  // Reduce product stock and credit sellers
  items.forEach((item: any) => {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - item.quantity);
      // Give seller some revenue
      const s = sellers.find(sel => sel.id === p.sellerId);
      if (s) {
        s.revenue += item.price * item.quantity;
        s.salesCount += item.quantity;
      }
    }
  });

  res.status(201).json(newOrder);
});

// Update Order tracking (packed -> shipped -> out for delivery -> delivered)
app.post("/api/orders/:id/status", (req, res) => {
  const { status, description } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const validStatuses = ["Packed", "Shipped", "Out for Delivery", "Delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  order.status = status as any;
  order.trackingTimeline.push({
    status,
    time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    description: description || `Order status shifted to ${status}`
  });

  res.json({ success: true, order });
});

// Disputes Page
app.get("/api/disputes", (req, res) => {
  res.json(disputes);
});

app.post("/api/disputes", (req, res) => {
  const { orderId, buyerName, sellerId, reason, details } = req.body;
  const newDispute = {
    id: "DIS-" + Math.floor(100 + Math.random() * 900),
    orderId,
    buyerName: buyerName || "kiruthikaganeshkiruthika@gmail.com",
    sellerId: sellerId || "seller_1",
    reason,
    details,
    status: "pending" as const,
    createdAt: new Date().toISOString()
  };

  disputes.unshift(newDispute);
  res.status(201).json(newDispute);
});

app.put("/api/disputes/:id", (req, res) => {
  const { status, resolutionNotes } = req.body;
  const dispute = disputes.find(d => d.id === req.params.id);
  if (!dispute) {
    return res.status(404).json({ error: "Dispute not found" });
  }

  dispute.status = status;
  dispute.resolutionNotes = resolutionNotes;
  res.json({ success: true, dispute });
});

// Live Selling Streams
app.get("/api/streams", (req, res) => {
  res.json(liveStreams);
});

app.post("/api/streams", (req, res) => {
  const { sellerId, shopName, title, featuredProductId } = req.body;
  const newStream = {
    id: "live_" + Math.random().toString(36).substr(2, 9),
    sellerId: sellerId || "seller_1",
    shopName: shopName || "Active Shop",
    title: title || "Live Product Demo",
    viewerCount: 25,
    isActive: true,
    streamUrl: "https://assets.mixkit.co/videos/preview/mixkit-carpenter-shaping-wood-with-chisel-on-lathe-40348-large.mp4",
    featuredProductId: featuredProductId || "prod_wood_lamp",
    messages: [
      { userName: "System", text: "Stream launched! Say hello to the vendor.", time: "Just now" }
    ]
  };

  liveStreams.unshift(newStream);
  res.status(201).json(newStream);
});

app.post("/api/streams/:id/messages", (req, res) => {
  const { userName, text } = req.body;
  const stream = liveStreams.find(s => s.id === req.params.id);
  if (!stream) {
    return res.status(404).json({ error: "Stream not found" });
  }

  const newMessage = {
    userName: userName || "Visitor",
    text,
    time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  };

  stream.messages.push(newMessage);
  stream.viewerCount += Math.floor(Math.random() * 3) - 1; // Fluctuating viewer count
  if (stream.viewerCount < 1) stream.viewerCount = 1;

  res.json({ success: true, stream });
});

// -------------------------------------------------------------
// AI-Powered Feature Endpoints (Leveraging Gemini API)
// -------------------------------------------------------------

// AI Smart Product Description Generator (Image to Title, Description, Tags, Suggested Price)
app.post("/api/ai/describe", async (req, res) => {
  const { imageBase64, category } = req.body;
  
  const ai = getGeminiClient();
  if (!ai) {
    // Return stunning custom realistic mocked response when GEMINI_API_KEY is not set
    const mockResponses: Record<string, any> = {
      apparel: {
        title: "Classic Retro Casual Crewneck Sweatshirt",
        description: "Exude cozy vibes with this ultra-soft, premium combed cotton crewneck sweatshirt. Features double-needle coverseamed ribbed collar and vintage-inspired athletic cuffs. Built for durable long-lasting streetwear aesthetics.",
        tags: ["sweatshirt", "retro", "cozy", "streetwear", "minimalist"],
        suggestedPrice: 45
      },
      home: {
        title: "Ambient Natural Bamboo Desk Organizer",
        description: "De-clutter your creative zone cleanly with this sustainable natural bamboo workspace companion. Includes multi-tier dynamic compartments tailored perfectly for note pads, pens, cards, and phone docks.",
        tags: ["bamboo", "organizer", "office", "handmade", "sustainable"],
        suggestedPrice: 28
      }
    };

    const sel = category?.toLowerCase().includes("apparel") ? mockResponses.apparel : mockResponses.home;
    return res.json(sel);
  }

  try {
    let response;
    
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      };

      const prompt = `Analyze this uploaded product photo carefully for its material, aesthetics, category, and premium level.
Then generate high-quality product listings details:
1. Product Title: Catchy, marketable, search-optimized.
2. SEO Description: A highly professional, rich 3-sentence description emphasizing build quality and utility.
3. 5 relevant Tags.
4. Suggested Price (in USD, as an integer number).

Return JSON response matching this schema strictly:
{
  "title": "string",
  "description": "string",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "suggestedPrice": number
}`;

      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, prompt],
        config: {
          responseMimeType: "application/json"
        }
      });
    } else {
      // Text-only draft descriptor helper
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Draft complete listing details for product category: "${category}". 
Return JSON strictly with properties: title, description, tags (5 strings), and suggestedPrice (number).`,
        config: {
          responseMimeType: "application/json"
        }
      });
    }

    const output = JSON.parse(response.text.trim());
    res.json(output);
  } catch (error: any) {
    console.error("AI Describe Error:", error);
    res.status(500).json({ error: "AI product description generation failed: " + error.message });
  }
});

// AI Price Suggester
app.post("/api/ai/suggest-price", async (req, res) => {
  const { title, category, tags, baseCost } = req.body;
  const cost = Number(baseCost) || 20;

  const ai = getGeminiClient();
  if (!ai) {
    // Mock Price Suggestions
    const optimal = Math.round(cost * 1.6);
    return res.json({
      suggestedPrice: optimal,
      justification: `Based on similar items in the "${category || "General"}" sector, products with tags like ${tags || "handmade"} carry a premium markup. We suggest setting a price of $${optimal} (allowing a robust 60% gross margin above base cost) to match competitive local delivery benchmarks.`
    });
  }

  try {
    const prompt = `You are a professional e-commerce strategic pricing consultant.
Provide the optimal price suggestion for a product with the following traits:
- Product Title: "${title}"
- Category: "${category}"
- Tags: "${tags}"
- Seller base manufacturing cost: $${cost}

We want to maximize profit margins while remaining highly competitive.
Analyze standard market markups and similar catalog data, then return JSON format:
{
  "suggestedPrice": number,
  "justification": "A persuasive 2-sentence explanation of why this pricing maximizes profitability and matches competitor indices."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text.trim());
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: "Price suggestions failed: " + err.message });
  }
});

// Chatbot Concierge (Context-aware customer service answering questions 24/7)
app.post("/api/ai/chatbot", async (req, res) => {
  const { message, chatHistory } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    const defaultResponse = "I'd be happy to assist you! As the server is currently in development mode, I can help mock your orders. If you ask 'Where is my order?', your current order ORD-9831 has been shipped via standard express and is estimated to arrive in 24 hours. Let me know if you need any other assistance!";
    return res.json({ text: defaultResponse });
  }

  try {
    // Gather system context: current active orders, product listings, dispute/refund policies
    const context = `You are the friendly 24/7 AI Customer Concierge for our multi-vendor e-commerce platform.
System Status & Catalog Context:
- Current products in store: ${products.map(p => `${p.title} (Price: $${p.price}, Stock: ${p.stock})`).join(", ")}
- Current orders tracking: ${orders.map(o => `Order ${o.id} status is "${o.status}", contains items: ${o.items.map(i => i.title).join(", ")}, address is ${o.deliveryAddress.street}, pincode ${o.deliveryAddress.pincode}`).join("; ")}
- General Return/Refund Policy: 14-day hassle-free returns. Disputes can be raised on the order page, which goes straight to a dedicated Admin Dispute Arbitration panel for refunds or mediation.
- Loyalty system: Customers earn 1 loyalty point per dollar spent. Loyalty points can be applied at checkout for custom cash-back discounts!

Answer the customer message accurately, cordially, and strictly within the boundaries of our actual store context. Keep your response brief, helpful, and scannable.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: context
      }
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (err: any) {
    res.status(500).json({ error: "Concierge Chat failed: " + err.message });
  }
});


// -------------------------------------------------------------
// Vite DevServer and Static Assets Middleware
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Multi-Vendor E-Commerce running at http://localhost:${PORT}`);
  });
}

startServer();
