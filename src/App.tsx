/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  TrendingUp,
  Bot,
  ShieldCheck,
  ShieldAlert,
  Upload,
  Plus,
  Search,
  Heart,
  MapPin,
  Award,
  Clock,
  Coins,
  Truck,
  QrCode,
  Video,
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Camera,
  Store,
  BarChart3,
  Check,
  X,
  FileText,
  Send,
  UserCheck,
  ChevronRight,
  Layers,
  ShoppingBag,
  Gavel,
  History,
  LifeBuoy,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import { Product, Auction, Review, Order, Seller, Dispute, LiveStream } from './types';

export default function App() {
  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [currentTab, setCurrentTab] = useState<string>('shop');

  // Core Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [streams, setStreams] = useState<LiveStream[]>([]);

  // Selection & UI states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [isAuditingReview, setIsAuditingReview] = useState<boolean>(false);

  // Cart & Checkout states
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [pinCode, setPinCode] = useState<string>('94086');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('Tomorrow (Hyper-local delivery)');
  const [shippingStreet, setShippingStreet] = useState<string>('123 Innovation Drive, Silicon Valley');
  const [shippingCity, setShippingCity] = useState<string>('Sunnyvale');
  const [userLoyaltyPoints, setUserLoyaltyPoints] = useState<number>(350);
  const [applyPoints, setApplyPoints] = useState<boolean>(false);

  // Search, Filters & Visual Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visualSearchActive, setVisualSearchActive] = useState<boolean>(false);

  // AI Product Listing Generator state
  const [newProdTitle, setNewProdTitle] = useState<string>('');
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<string>('');
  const [newProdStock, setNewProdStock] = useState<string>('5');
  const [newProdCategory, setNewProdCategory] = useState<string>('Home & Living');
  const [newProdTags, setNewProdTags] = useState<string>('');
  const [newProdImage, setNewProdImage] = useState<string>('');
  const [isGeneratingListing, setIsGeneratingListing] = useState<boolean>(false);

  // AI Price Suggester state
  const [pricingCost, setPricingCost] = useState<string>('30');
  const [priceSuggestion, setPriceSuggestion] = useState<{ suggestedPrice: number; justification: string } | null>(null);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState<boolean>(false);

  // CSV Bulk Uploader
  const [csvText, setCsvText] = useState<string>('');
  const [bulkUploadSuccess, setBulkUploadSuccess] = useState<string | null>(null);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your 24/7 AI Customer Concierge. Ask me anything about products, policies, or order status (try: "Where is my order ORD-9831?").' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Auction State
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [newAuctionTitle, setNewAuctionTitle] = useState<string>('');
  const [newAuctionDesc, setNewAuctionDesc] = useState<string>('');
  const [newAuctionStartPrice, setNewAuctionStartPrice] = useState<string>('150');
  const [newAuctionImage, setNewAuctionImage] = useState<string>('');
  const [newAuctionDuration, setNewAuctionDuration] = useState<string>('24');

  // Live Stream State
  const [streamChat, setStreamChat] = useState<string>('');
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);

  // Dispute creation
  const [disputeOrderId, setDisputeOrderId] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('Damaged Delivery Packaging');
  const [disputeDetails, setDisputeDetails] = useState<string>('');
  const [disputeSuccess, setDisputeSuccess] = useState<boolean>(false);

  // Verification document state
  const [verificationDoc, setVerificationDoc] = useState<string>('');
  const [isSubmittingVerify, setIsSubmittingVerify] = useState<boolean>(false);

  // Timing count simulator
  const [timeCounter, setTimeCounter] = useState<number>(3600);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      const [resProducts, resSellers, resAuctions, resOrders, resDisputes, resStreams] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/sellers').then(r => r.json()),
        fetch('/api/auctions').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/disputes').then(r => r.json()),
        fetch('/api/streams').then(r => r.json())
      ]);

      setProducts(resProducts);
      setSellers(resSellers);
      setAuctions(resAuctions);
      setOrders(resOrders);
      setDisputes(resDisputes);
      setStreams(resStreams);

      if (resStreams && resStreams.length > 0) {
        setActiveStream(resStreams[0]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setTimeCounter((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update pin code delivery estimation
  useEffect(() => {
    if (pinCode.startsWith('90') || pinCode.startsWith('94')) {
      setDeliveryEstimate('Tomorrow (Hyper-local Express)');
    } else if (pinCode.startsWith('1') || pinCode.startsWith('2')) {
      setDeliveryEstimate('4-5 Business Days (Standard Ground)');
    } else {
      setDeliveryEstimate('2-3 Business Days (Regional Fast Delivery)');
    }
  }, [pinCode]);

  // Image category samples for quick AI analysis
  const PRESET_IMAGES = [
    {
      label: "Classic Sweatshirt",
      category: "Apparel",
      url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop"
    },
    {
      label: "Modern Vase",
      category: "Home & Living",
      url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&auto=format&fit=crop"
    },
    {
      label: "Designer Watch",
      category: "Electronics",
      url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&auto=format&fit=crop"
    }
  ];

  // AI Multimodal generator triggering
  const triggerAIDescribe = async (customUrl?: string) => {
    setIsGeneratingListing(true);
    const imageUrl = customUrl || newProdImage || PRESET_IMAGES[0].url;
    
    try {
      // Simulate base64 converter or send sample category for AI drafting
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageUrl,
          category: newProdCategory
        })
      });

      const data = await res.json();
      if (data) {
        setNewProdTitle(data.title || '');
        setNewProdDesc(data.description || '');
        setNewProdTags(data.tags ? data.tags.join(', ') : '');
        setNewProdPrice(data.suggestedPrice ? String(data.suggestedPrice) : '45');
        setNewProdImage(imageUrl);
      }
    } catch (err) {
      console.error('AI describe error:', err);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  // AI Price Suggester
  const triggerPriceSuggest = async () => {
    setIsSuggestingPrice(true);
    try {
      const res = await fetch('/api/ai/suggest-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProdTitle || 'Premium Craftsmanship Item',
          category: newProdCategory,
          tags: newProdTags,
          baseCost: pricingCost
        })
      });

      const data = await res.json();
      setPriceSuggestion(data);
    } catch (err) {
      console.error('AI price suggest error:', err);
    } finally {
      setIsSuggestingPrice(false);
    }
  };

  // Place order
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const items = cart.map(c => ({
      productId: c.product.id,
      title: c.product.title,
      price: c.product.price,
      quantity: c.quantity,
      image: c.product.image
    }));

    const totalAmount = cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: 'kiruthikaganeshkiruthika@gmail.com',
          items,
          totalAmount: applyPoints ? Math.max(0, totalAmount - 20) : totalAmount,
          deliveryAddress: {
            street: shippingStreet,
            city: shippingCity,
            pincode: pinCode
          }
        })
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders([newOrder, ...orders]);
        setCart([]);
        setApplyPoints(false);
        if (applyPoints) {
          setUserLoyaltyPoints(prev => Math.max(0, prev - 200));
        } else {
          setUserLoyaltyPoints(prev => prev + Math.round(totalAmount));
        }
        alert(`Order placed successfully! Order ID: ${newOrder.id}. Secure payment holds funds in Escrow until you confirm delivery.`);
        setCurrentTab('orders');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  // Submit product review with AI Fake Review audit
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsAuditingReview(true);

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newReviewRating,
          comment: newReviewComment,
          userName: 'kiruthikaganeshkiruthika@gmail.com'
        })
      });

      if (res.ok) {
        const addedReview = await res.json();
        setProductReviews([addedReview, ...productReviews]);
        setNewReviewComment('');
        // Refresh product rating
        fetchData();
      }
    } catch (err) {
      console.error('Review audit error:', err);
    } finally {
      setIsAuditingReview(false);
    }
  };

  // Send chatbot query
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, chatHistory: chatMessages })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Send message in Live Selling Stream
  const handleStreamChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamChat.trim() || !activeStream) return;

    try {
      const res = await fetch(`/api/streams/${activeStream.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: 'kiruthika@gmail.com',
          text: streamChat
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveStream(data.stream);
        setStreamChat('');
      }
    } catch (err) {
      console.error('Stream chat error:', err);
    }
  };

  // Place a Bid
  const placeBid = async (auctionId: string) => {
    const amount = bidAmounts[auctionId];
    if (!amount) return;

    try {
      const res = await fetch('/api/auctions/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auctionId,
          bidderName: 'kiruthikaganeshkiruthika@gmail.com',
          bidAmount: amount
        })
      });

      const data = await res.json();
      if (res.ok) {
        // update list
        setAuctions(auctions.map(a => a.id === auctionId ? data.auction : a));
        setBidAmounts({ ...bidAmounts, [auctionId]: '' });
        alert(`Successfully placed a bid of $${amount}! You are now the highest bidder.`);
      } else {
        alert(data.error || 'Bid placement failed.');
      }
    } catch (err) {
      console.error('Bid error:', err);
    }
  };

  // Create Auction
  const createAuctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAuctionTitle,
          description: newAuctionDesc,
          startingPrice: newAuctionStartPrice,
          durationHours: newAuctionDuration,
          image: newAuctionImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
          sellerId: 'seller_1'
        })
      });

      if (res.ok) {
        const added = await res.json();
        setAuctions([added, ...auctions]);
        setNewAuctionTitle('');
        setNewAuctionDesc('');
        setNewAuctionStartPrice('150');
        alert('Auction Listing Published! Collectors can now bid in real-time.');
        setCurrentTab('auctions');
      }
    } catch (err) {
      console.error('Auction creation error:', err);
    }
  };

  // File CSV upload simulation
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText, sellerId: 'seller_1' })
      });

      const data = await res.json();
      if (res.ok) {
        setBulkUploadSuccess(`Successfully loaded ${data.count} products via bulk CSV parser.`);
        setProducts([...data.products, ...products]);
        setCsvText('');
      } else {
        setBulkUploadSuccess(`Error: ${data.error}`);
      }
    } catch (err) {
      setBulkUploadSuccess('Failed to upload CSV. Check format.');
    }
  };

  // Submit Product Creator
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProdTitle,
          description: newProdDesc,
          price: newProdPrice,
          stock: newProdStock,
          category: newProdCategory,
          tags: newProdTags,
          image: newProdImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
          sellerId: 'seller_1'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProducts([data, ...products]);
        alert('Product Listing successfully verified and published to storefront!');
        setNewProdTitle('');
        setNewProdDesc('');
        setNewProdPrice('');
        setNewProdTags('');
        setNewProdImage('');
        setCurrentTab('shop');
      }
    } catch (err) {
      console.error('Product submit error:', err);
    }
  };

  // Verification request submit
  const submitVerification = async () => {
    setIsSubmittingVerify(true);
    try {
      const res = await fetch('/api/sellers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: 'seller_3',
          idPhotoBase64: verificationDoc || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop'
        })
      });

      if (res.ok) {
        fetchData();
        alert('ID submitted! An administrator will audit the credential to issue the "Verified Seller" badge shortly.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  // Admin approves verification
  const approveVerification = async (sellerId: string, approve: boolean) => {
    try {
      const res = await fetch('/api/admin/verify-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, approve })
      });

      if (res.ok) {
        fetchData();
        alert(approve ? 'Seller status set to Verified!' : 'Seller verification rejected.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // File Dispute
  const createDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeOrderId) return;

    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: disputeOrderId,
          buyerName: 'kiruthikaganeshkiruthika@gmail.com',
          sellerId: 'seller_1',
          reason: disputeReason,
          details: disputeDetails
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDisputes([data, ...disputes]);
        setDisputeSuccess(true);
        setDisputeDetails('');
        setDisputeOrderId('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin resolves dispute
  const handleResolveDispute = async (disputeId: string, status: 'resolved_refunded' | 'resolved_dismissed', notes: string) => {
    try {
      const res = await fetch(`/api/disputes/${disputeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes: notes })
      });

      if (res.ok) {
        fetchData();
        alert(`Dispute set to ${status}. Notification dispatched to both buyer and seller.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Cart helper functions
  const addToCart = (product: Product) => {
    const existing = cart.find(c => c.product.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    alert(`"${product.title}" has been successfully appended to your secure escrow cart.`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.product.id !== id));
  };

  const selectProductDetails = async (product: Product) => {
    setSelectedProduct(product);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`);
      const data = await res.json();
      setProductReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Helper timer view
  const formatTimer = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Computed Values
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
      
      {/* ==========================================
          SIDEBAR NAVIGATION
          ========================================== */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col p-6 shrink-0 justify-between">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">S</div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">SELLIFY <span className="text-indigo-600">AI</span></span>
            </div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold ml-1">Multi-Vendor Hub</p>
          </div>

          {/* Interactive Role Switcher with exquisite badges */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Access Persona</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => { setCurrentRole('buyer'); setCurrentTab('shop'); }}
                className={`py-1.5 text-xs font-semibold rounded-md transition ${currentRole === 'buyer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Buyer
              </button>
              <button
                onClick={() => { setCurrentRole('seller'); setCurrentTab('seller-dashboard'); }}
                className={`py-1.5 text-xs font-semibold rounded-md transition ${currentRole === 'seller' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Seller
              </button>
              <button
                onClick={() => { setCurrentRole('admin'); setCurrentTab('admin-disputes'); }}
                className={`py-1.5 text-xs font-semibold rounded-md transition ${currentRole === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Dynamic tabs based on currentRole */}
          <nav className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Navigation</span>
            {currentRole === 'buyer' && (
              <>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'shop' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Store className="w-4 h-4" /> Discover Store
                </button>
                <button
                  onClick={() => setCurrentTab('auctions')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'auctions' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Gavel className="w-4 h-4" /> Live Bidding / Auctions
                </button>
                <button
                  onClick={() => setCurrentTab('stream')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'stream' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Video className="w-4 h-4" /> Live Commerce
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto" />
                </button>
                <button
                  onClick={() => setCurrentTab('orders')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'orders' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <History className="w-4 h-4" /> My Orders & Escrow
                </button>
                <button
                  onClick={() => setCurrentTab('chatbot')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'chatbot' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Bot className="w-4 h-4" /> AI Support Concierge
                </button>
                <button
                  onClick={() => setCurrentTab('claims')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'claims' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <LifeBuoy className="w-4 h-4" /> Disputes Resolution
                </button>
              </>
            )}

            {currentRole === 'seller' && (
              <>
                <button
                  onClick={() => setCurrentTab('seller-dashboard')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'seller-dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <BarChart3 className="w-4 h-4" /> Sales Analytics
                </button>
                <button
                  onClick={() => setCurrentTab('create-product')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'create-product' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <PlusCircle className="w-4 h-4" /> AI Listing Architect
                </button>
                <button
                  onClick={() => setCurrentTab('bulk-upload')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'bulk-upload' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <FileText className="w-4 h-4" /> Bulk CSV Loader
                </button>
                <button
                  onClick={() => setCurrentTab('seller-verify')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'seller-verify' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <UserCheck className="w-4 h-4" /> Trust Verification
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentTab('admin-disputes')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'admin-disputes' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <ShieldAlert className="w-4 h-4" /> Claims Arbitration
                </button>
                <button
                  onClick={() => setCurrentTab('admin-verifications')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 ${currentTab === 'admin-verifications' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <ShieldCheck className="w-4 h-4" /> Vendor Audits
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Footer info showing loyalty points & state indicators */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          {currentRole === 'buyer' && (
            <div className="bg-indigo-50 rounded-lg p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                <Coins className="w-4 h-4 text-indigo-500" />
                <span>Loyalty Points</span>
              </div>
              <span className="font-extrabold text-indigo-800">{userLoyaltyPoints} pts</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500">Secure Escrow Network</span>
          </div>
          <div className="text-[10px] text-slate-400">
            User: { 'kiruthika@gmail.com' }
          </div>
        </div>
      </aside>

      {/* ==========================================
          MAIN WORKSPACE
          ========================================== */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dynamic Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {currentTab === 'shop' && 'Store Explorer'}
              {currentTab === 'auctions' && 'Collectors Bidding Arena'}
              {currentTab === 'stream' && 'Interactive Live Streaming'}
              {currentTab === 'orders' && 'Buyer Shipments Tracking'}
              {currentTab === 'chatbot' && 'AI Customer Concierge'}
              {currentTab === 'claims' && 'Escrow Dispute Portal'}
              {currentTab === 'seller-dashboard' && 'Vendor Intelligence Hub'}
              {currentTab === 'create-product' && 'AI Multimodal Listing Architect'}
              {currentTab === 'bulk-upload' && 'Bulk Stock Loader'}
              {currentTab === 'seller-verify' && 'Trust and Credentials Verification'}
              {currentTab === 'admin-disputes' && 'Escrow Dispute Board'}
              {currentTab === 'admin-verifications' && 'Vendor Verification Board'}
            </h1>
            <p className="text-xs text-slate-400">
              {currentRole === 'buyer' && 'Browse listings, track escrow balances, or talk with AI.'}
              {currentRole === 'seller' && 'Model pricing matrices, launch live selling, or write SEO text via AI.'}
              {currentRole === 'admin' && 'Arbitrate platform holds, approve merchant badges, and monitor logs.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData} 
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-500 hover:text-indigo-600"
              title="Refresh Platform State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg border border-indigo-100">
              System UTC: 16:50
            </span>
          </div>
        </header>

        {/* Dynamic Content Frame */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">

          {/* ==========================================
              TAB: BUYER STOREFRONT
              ========================================== */}
          {currentTab === 'shop' && (
            <div className="space-y-8">
              {/* Promo Banner with complete-the-look bundle */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg z-10">
                  <div className="bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 font-extrabold text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full inline-block">
                    AI Curated Bundle
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight">"Complete the Look" Styling</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our AI has bundled the **Handcrafted Maple Lamp** with the **Vintage Wash Denim Jacket** to unlock custom discounts.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-lg font-bold text-white">$175.00 <span className="text-slate-400 line-through text-xs font-normal">$249.00</span></span>
                    <button 
                      onClick={() => {
                        const lamp = products.find(p => p.id === 'prod_wood_lamp');
                        const jacket = products.find(p => p.id === 'prod_denim_jacket');
                        if (lamp) addToCart(lamp);
                        if (jacket) addToCart(jacket);
                      }}
                      className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-500 transition shadow-md"
                    >
                      Bundle & Add to Cart
                    </button>
                  </div>
                </div>
                <div className="flex -space-x-8 shrink-0 select-none z-10 opacity-80 hover:opacity-100 transition duration-300">
                  <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=160&auto=format&fit=crop" className="w-24 h-24 rounded-xl object-cover border-4 border-slate-800 rotate-[-6deg]" />
                  <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=160&auto=format&fit=crop" className="w-24 h-24 rounded-xl object-cover border-4 border-slate-800 rotate-[6deg]" />
                </div>
              </div>

              {/* Shopping Dashboard (Store view + Cart checkout) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Store Catalog */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Search and Category Filter with Visual Search Mock */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search standard listings, handcraft tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition shadow-sm"
                      />
                    </div>
                    
                    {/* Visual Search Toggle Button */}
                    <button
                      onClick={() => setVisualSearchActive(!visualSearchActive)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition ${visualSearchActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Camera className="w-4 h-4" />
                      Visual Search
                    </button>
                  </div>

                  {/* Visual Search Simulated Box */}
                  {visualSearchActive && (
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Visual Similarity Search Active
                        </span>
                        <button onClick={() => setVisualSearchActive(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Upload or pick a catalog segment below to search for corresponding color layouts & shapes:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchQuery(img.category);
                              setVisualSearchActive(false);
                            }}
                            className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2 hover:border-indigo-500 transition text-left"
                          >
                            <img src={img.url} className="w-8 h-8 rounded object-cover" />
                            <span className="text-[10px] font-bold text-slate-700 block truncate">{img.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Pill Filters */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {['All', 'Home & Living', 'Apparel', 'Electronics'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredProducts.map((p) => {
                      const merchant = sellers.find(s => s.id === p.sellerId);
                      return (
                        <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between">
                          <div>
                            <div className="relative h-48 bg-slate-100">
                              <img src={p.image} className="w-full h-full object-cover" />
                              {merchant?.isVerified && (
                                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                </span>
                              )}
                              {p.originalPrice && p.price < p.originalPrice && (
                                <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
                                  Save {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                                </span>
                              )}
                            </div>
                            
                            <div className="p-5 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                                <div className="flex items-center gap-1 text-amber-500">
                                  <span className="text-xs font-bold">{p.rating}</span>
                                  <span className="text-[10px]">★</span>
                                </div>
                              </div>
                              <h3 className="font-extrabold text-slate-800 text-sm leading-tight hover:text-indigo-600 transition cursor-pointer" onClick={() => selectProductDetails(p)}>
                                {p.title}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {p.description}
                              </p>

                              {/* Competitor Price Alerts */}
                              {p.competitorPrice && p.competitorPrice > p.price && (
                                <div className="p-1.5 bg-emerald-50 rounded-lg text-[10px] text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5" /> Platform Best Price! (Compare Competitor: ${p.competitorPrice})
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-slate-900">${p.price}</span>
                              {p.originalPrice && (
                                <span className="text-xs text-slate-400 line-through ml-2">${p.originalPrice}</span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => selectProductDetails(p)}
                                className="px-2.5 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                              >
                                Reviews
                              </button>
                              <button 
                                onClick={() => addToCart(p)}
                                className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition"
                              >
                                Add Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Escrow Cart Checkout Section */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h2 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3 flex items-center justify-between">
                      <span>Secure Escrow Cart</span>
                      <span className="bg-indigo-50 text-indigo-600 text-xs font-extrabold px-2 py-0.5 rounded-md">{cart.length} items</span>
                    </h2>

                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <ShoppingBag className="w-8 h-8 mx-auto stroke-[1.5]" />
                        <p className="text-xs font-semibold">Your secure escrow cart is empty</p>
                        <p className="text-[10px]">Your funds are held securely until delivery is confirmed.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {cart.map((c) => (
                            <div key={c.product.id} className="flex gap-3 justify-between items-center text-xs border-b border-slate-50 pb-2.5">
                              <img src={c.product.image} className="w-10 h-10 rounded object-cover" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-700 truncate">{c.product.title}</h4>
                                <p className="text-slate-400">Qty: {c.quantity} × ${c.product.price}</p>
                              </div>
                              <button type="button" onClick={() => removeFromCart(c.product.id)} className="text-slate-400 hover:text-rose-500 transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Loyalty System Applied */}
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-800 flex items-center gap-1.5">
                              <Coins className="w-4 h-4 text-amber-500" /> Apply Loyalty points
                            </span>
                            <span className="text-slate-500 text-[10px]">{userLoyaltyPoints} available</span>
                          </div>
                          <p className="text-[10px] text-amber-700/80 my-1">
                            Redeem 200 points to save flat $20.00 off order.
                          </p>
                          <label className="flex items-center gap-2 mt-2 font-semibold text-amber-800">
                            <input 
                              type="checkbox" 
                              checked={applyPoints} 
                              disabled={userLoyaltyPoints < 200}
                              onChange={(e) => setApplyPoints(e.target.checked)}
                              className="accent-amber-600"
                            />
                            <span>Redeem - $20 Discount</span>
                          </label>
                        </div>

                        {/* Hyperlocal Delivery Pin Code Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600 block">Pin Code (Hyper-local delivery)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={5}
                              value={pinCode}
                              onChange={(e) => setPinCode(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-500 transition w-28"
                            />
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-500 flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{deliveryEstimate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Checkout details */}
                        <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Subtotal:</span>
                            <span className="font-semibold">${cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0)}</span>
                          </div>
                          {applyPoints && (
                            <div className="flex justify-between text-rose-600 font-semibold">
                              <span>Loyalty Discount:</span>
                              <span>-$20.00</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Escrow Commission:</span>
                            <span className="text-emerald-600 font-semibold">FREE</span>
                          </div>
                          <div className="flex justify-between text-sm font-extrabold text-slate-800 pt-2 border-t border-slate-50">
                            <span>Total Secure Hold:</span>
                            <span>${applyPoints ? Math.max(0, cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0) - 20) : cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0)}</span>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
                        >
                          Lock Funds & Place Order
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Escrow Guarantee Statement */}
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4 text-xs space-y-1">
                    <h4 className="font-extrabold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Buyer Escrow Guarantee
                    </h4>
                    <p className="text-[10px] leading-relaxed text-emerald-700">
                      Payment stays protected in Sellify's smart platform contract. Money will only be released to the vendor once you confirm delivery. Hassle-free arbitration in 24 hours.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              PRODUCT DETAILS & AUDITED REVIEWS MODAL
              ========================================== */}
          {selectedProduct && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedProduct.category} Detail Review Audit</span>
                  <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body scroll */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Info block */}
                  <div className="flex gap-4">
                    <img src={selectedProduct.image} className="w-24 h-24 rounded-lg object-cover border border-slate-200" />
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-800">{selectedProduct.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-indigo-600">${selectedProduct.price}</span>
                        <span className="text-xs text-slate-400">Available: {selectedProduct.stock} units</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">{selectedProduct.description}</p>
                    </div>
                  </div>

                  {/* AI Bot Audit Status */}
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-indigo-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-indigo-900">AI Trust & Review Auditor</h4>
                      <p className="text-[10px] text-indigo-700 leading-relaxed">
                        Every submission is actively evaluated by a deep auditing NLP classifier to protect against artificial ratings, repetitive patterns, or sponsored feedback campaigns.
                      </p>
                    </div>
                  </div>

                  {/* Add Review form */}
                  <form onSubmit={submitReview} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700">Write an Audited Review</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">RATING</label>
                        <select 
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="5">5 Stars (Excellent)</option>
                          <option value="4">4 Stars (Good)</option>
                          <option value="3">3 Stars (Average)</option>
                          <option value="2">2 Stars (Suspicious)</option>
                          <option value="1">1 Star (Very Bad)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">AUDIT PREVIEW</label>
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded inline-block">
                          Active NLP Model
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">COMMENT</label>
                      <textarea
                        required
                        placeholder="Write your genuine feedback. Warning: highly repetitive comment structures may trigger a bot flag."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 min-h-[60px]"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={isAuditingReview}
                        className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-500 transition flex items-center gap-1.5"
                      >
                        {isAuditingReview ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Auditing with AI...
                          </>
                        ) : 'Submit & Audit Review'}
                      </button>
                    </div>
                  </form>

                  {/* Reviews list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Customer Feedbacks ({productReviews.length})</h4>
                    <div className="space-y-2.5">
                      {productReviews.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No reviews recorded yet for this product.</p>
                      ) : (
                        productReviews.map((rev) => (
                          <div key={rev.id} className={`p-3.5 rounded-xl border ${rev.isSuspicious ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50/50 border-slate-150'} space-y-1.5`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">{rev.userName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-amber-500">{'★'.repeat(rev.rating)}</span>
                                <span className="text-[10px] text-slate-400">{rev.date}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                            
                            {/* AI Trust Suspicious Badge */}
                            {rev.isSuspicious ? (
                              <div className="p-2 bg-amber-100 rounded text-[10px] text-amber-800 font-semibold border border-amber-200 flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-extrabold uppercase">Suspicious Bot Pattern Flagged</span>
                                  <p className="text-[9px] font-normal leading-normal text-amber-700/90 mt-0.5">{rev.suspicionReason}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> AI TRUST AUDITED (Verified Purchase)
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB: LIVE BIDDING / AUCTIONS
              ========================================== */}
          {currentTab === 'auctions' && (
            <div className="space-y-6">
              
              {/* Info banner */}
              <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 flex items-center gap-4">
                <Gavel className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-extrabold text-amber-900">Live Vintage & Handcraft Bidding Pool</h3>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Sellers list limited run, vintage, or rare creations here. The timer countdown determines when the final bid holds and locks funds into the Escrow contract.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Active Auctions list */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Collector Bids</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {auctions.map((auc) => (
                      <div key={auc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="relative h-44 bg-slate-100">
                            <img src={auc.image} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {formatTimer(timeCounter)}
                            </div>
                            <span className="absolute bottom-3 left-3 bg-indigo-900/80 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-1 rounded">
                              {auc.bidsCount} total bids
                            </span>
                          </div>

                          <div className="p-5 space-y-2">
                            <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{auc.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{auc.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-50">
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">START PRICE</span>
                                <span className="font-bold text-slate-700">${auc.startingPrice}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">CURRENT HIGHEST</span>
                                <span className="font-extrabold text-indigo-600 text-sm">${auc.currentBid}</span>
                              </div>
                            </div>

                            {auc.highBidder && (
                              <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded p-1.5 flex items-center gap-1">
                                <Check className="w-3 h-3" /> High Bidder: {auc.highBidder}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                          <input
                            type="number"
                            placeholder={`Min $${auc.currentBid + auc.minIncrement}`}
                            value={bidAmounts[auc.id] || ''}
                            onChange={(e) => setBidAmounts({ ...bidAmounts, [auc.id]: e.target.value })}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 w-28"
                          />
                          <button
                            onClick={() => placeBid(auc.id)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-1.5 rounded-lg transition"
                          >
                            Place Bid
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to list an Auction (Seller Side perspective preview) */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3 flex items-center gap-1">
                      <Gavel className="w-4 h-4 text-indigo-500" /> Start Custom Auction
                    </h3>

                    <form onSubmit={createAuctionSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">COLLECTOR ITEM TITLE</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. 1920 Sterling Silver Spoon"
                          value={newAuctionTitle}
                          onChange={(e) => setNewAuctionTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">ITEM DESCRIPTION</label>
                        <textarea
                          required
                          placeholder="Provide details of authentication, condition, and origin..."
                          value={newAuctionDesc}
                          onChange={(e) => setNewAuctionDesc(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition min-h-[60px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">START BID ($)</label>
                          <input
                            required
                            type="number"
                            value={newAuctionStartPrice}
                            onChange={(e) => setNewAuctionStartPrice(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">DURATION (HRS)</label>
                          <select
                            value={newAuctionDuration}
                            onChange={(e) => setNewAuctionDuration(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition"
                          >
                            <option value="1">1 Hour</option>
                            <option value="12">12 Hours</option>
                            <option value="24">24 Hours</option>
                            <option value="48">48 Hours</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">PHOTO URL</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={newAuctionImage}
                          onChange={(e) => setNewAuctionImage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition"
                      >
                        Publish Auction
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB: LIVE COMMERCE
              ========================================== */}
          {currentTab === 'stream' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Simulated Live Stream Window */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl aspect-video flex flex-col justify-between p-6 text-white border-2 border-indigo-500/30">
                    
                    {/* Top Stats Banner */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-600 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">LIVE</span>
                        <span className="text-xs bg-slate-800/80 backdrop-blur-xs px-2.5 py-0.5 rounded font-bold">{activeStream?.viewerCount} viewers</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-300 tracking-tight bg-indigo-900/40 backdrop-blur-xs px-3 py-1 rounded border border-indigo-400/20">
                        Vendor Live Streaming Model
                      </span>
                    </div>

                    {/* Central Simulated Frame */}
                    <div className="absolute inset-0 select-none opacity-40 mix-blend-lighten pointer-events-none">
                      <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_100%)]" />
                    </div>

                    {/* Bottom Feature Card Overlay */}
                    <div className="z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 flex gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0">
                          <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FEATURED PINNED PRODUCT</span>
                          <h4 className="text-xs font-extrabold text-white">Handcrafted Maple Lamp</h4>
                          <span className="text-xs font-bold text-indigo-400">$120.00</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const lamp = products.find(p => p.id === 'prod_wood_lamp');
                          if (lamp) addToCart(lamp);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition"
                      >
                        Add to Cart Instantly
                      </button>
                    </div>

                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-sm">{activeStream?.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Streaming from **{activeStream?.shopName}**. Live woodturning techniques, exclusive discounts, and immediate escrow item purchase availability.
                    </p>
                  </div>
                </div>

                {/* Real-time Stream Chats */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[500px]">
                  <div className="space-y-4 overflow-hidden flex flex-col h-full">
                    <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                      <span>Live Stream Chat</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </h3>

                    {/* Chat feed scroll */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                      {activeStream?.messages.map((m, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-700">{m.userName}</span>
                            <span className="text-[9px] text-slate-400">{m.time}</span>
                          </div>
                          <p className="text-slate-600 bg-slate-50 rounded-lg p-2 leading-relaxed border border-slate-100">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleStreamChatSubmit} className="pt-3 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Comment live..."
                      value={streamChat}
                      onChange={(e) => setStreamChat(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB: BUYER ORDERS & ESCROW
              ========================================== */}
          {currentTab === 'orders' && (
            <div className="space-y-8">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Orders Escrow Status</h2>
              
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    
                    {/* Header */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-md">
                          ORDER {ord.id}
                        </span>
                        <p className="text-xs text-slate-400">Placed on: {new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-600">Secure Hold: <span className="text-slate-900">${ord.totalAmount}</span></span>
                        
                        {/* Status timeline indicator */}
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          ord.status === 'Delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          ord.status === 'Out for Delivery' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                          ord.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          ● {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Left: Items list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-700">Purchased Items</h4>
                        <div className="space-y-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 text-xs">
                              <img src={item.image} className="w-12 h-12 rounded object-cover border border-slate-100" />
                              <div>
                                <h5 className="font-bold text-slate-800 leading-snug">{item.title}</h5>
                                <p className="text-slate-400">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Saved Multi Address delivery profiles */}
                        <div className="p-3 bg-slate-50 rounded-lg text-[11px] border border-slate-150 space-y-1">
                          <span className="font-extrabold text-slate-600 block">SHIPPING ADDRESS PROFILE</span>
                          <p className="text-slate-500 font-medium">{ord.deliveryAddress.street}</p>
                          <p className="text-slate-400 font-medium">{ord.deliveryAddress.city}, Pincode: {ord.deliveryAddress.pincode}</p>
                        </div>
                      </div>

                      {/* Middle: Logistics timeline */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-700">Real-Time Logistics Timeline</h4>
                        <div className="space-y-4 relative border-l-2 border-slate-100 pl-4 ml-2">
                          {ord.trackingTimeline.map((time, tIdx) => (
                            <div key={tIdx} className="relative text-xs">
                              <div className="absolute w-3 h-3 bg-indigo-600 border-2 border-white rounded-full -left-[22px] top-1 shadow-sm" />
                              <div className="space-y-0.5">
                                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                                  {time.status}
                                  <span className="text-[9px] font-normal text-slate-400">{time.time}</span>
                                </span>
                                <p className="text-[11px] text-slate-500 leading-normal">{time.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Escrow actions + QR Code lookup */}
                      <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                            <QrCode className="w-4 h-4 text-slate-500" /> Quick Status QR Code
                          </h4>
                          <div className="w-24 h-24 bg-white p-2 rounded-lg border border-slate-200 mx-auto">
                            <img src={ord.qrCodeData} className="w-full h-full object-contain" />
                          </div>
                          <p className="text-[9px] text-center text-slate-400 font-medium">Scan with camera to track parcel on-the-go.</p>
                        </div>

                        {/* Escrow Release triggers */}
                        <div className="space-y-2">
                          {ord.status !== 'Delivered' ? (
                            <>
                              <button
                                onClick={async () => {
                                  const res = await fetch(`/api/orders/${ord.id}/status`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Delivered', description: 'Delivered safely. Buyer successfully checked and confirmed contents.' })
                                  });
                                  if (res.ok) {
                                    fetchData();
                                    alert('Funds released successfully! Money transfer executed to vendor wallet.');
                                  }
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition"
                              >
                                Confirm Delivery (Release Funds)
                              </button>
                              <p className="text-[9px] text-center text-slate-400">Pressing this confirms you have accepted the parcel and authorizes the escrow bank transfer.</p>
                            </>
                          ) : (
                            <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100 text-[10px] text-emerald-800 font-bold text-center">
                              ✓ FUNDS DISBURSED TO SELLER
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: AI CUSTOMER CONCIERGE CHATBOT
              ========================================== */}
          {currentTab === 'chatbot' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Bot Info Header */}
              <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white p-6 rounded-2xl border border-indigo-700 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="w-6 h-6 text-indigo-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">24/7 AI Customer Assistant</h3>
                  <p className="text-xs text-indigo-200 leading-normal max-w-lg">
                    Always online to check status logs, describe platform-wide return policies, or assist with catalog queries immediately.
                  </p>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[400px] flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                  {chatMessages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md rounded-xl p-3.5 leading-relaxed ${m.sender === 'user' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-50 text-slate-700 border border-slate-150'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 text-slate-400 border border-slate-150 rounded-xl p-3.5 text-xs flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-400" /> Thinking...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="pt-4 border-t border-slate-100 flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="Ask standard questions or query specific order status..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition shadow-sm"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1">
                    Send <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB: BUYER CLAIMS DISPUTES PORTAL
              ========================================== */}
          {currentTab === 'claims' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* File Dispute claim */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3 flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-indigo-500" /> File Dispute Arbitration
                    </h3>

                    {disputeSuccess && (
                      <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800 font-semibold space-y-1">
                        <p>✓ Dispute Successfully Filed!</p>
                        <p className="text-[10px] font-normal text-emerald-700">Funds are locked inside the escrow. Our admin panel will audit the claims immediately.</p>
                      </div>
                    )}

                    <form onSubmit={createDispute} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">ORDER NUMBER</label>
                        <select
                          required
                          value={disputeOrderId}
                          onChange={(e) => setDisputeOrderId(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                        >
                          <option value="">-- Choose Order --</option>
                          {orders.map(o => (
                            <option key={o.id} value={o.id}>Order: {o.id} (${o.totalAmount})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">REASON CATEGORY</label>
                        <select
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                        >
                          <option value="Damaged Delivery Packaging">Damaged Delivery Packaging</option>
                          <option value="Item Mismatch / Missing parts">Item Mismatch / Missing parts</option>
                          <option value="Failed Delivery timeline">Failed Delivery timeline</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">DETAILED PROOF / DESCRIPTION</label>
                        <textarea
                          required
                          placeholder="Provide detailed description of damage or mismatch to help arbitrator review..."
                          value={disputeDetails}
                          onChange={(e) => setDisputeDetails(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none min-h-[80px]"
                        />
                      </div>

                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition">
                        File Dispute & Hold Payment
                      </button>
                    </form>
                  </div>
                </div>

                {/* Tracking claims lists */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active disputes tracker</h2>
                  
                  <div className="space-y-4">
                    {disputes.map((dis) => (
                      <div key={dis.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-700">Arbitration ID: {dis.id}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${
                            dis.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }`}>
                            {dis.status === 'pending' ? 'UNDER INVESTIGATION' : 'RESOLVED'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs border-y border-slate-50 py-2">
                          <div>
                            <span className="text-slate-400 text-[10px] block">ORDER ID</span>
                            <span className="font-semibold">{dis.orderId}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">REASON</span>
                            <span className="font-semibold">{dis.reason}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500">{dis.details}</p>

                        {dis.resolutionNotes && (
                          <div className="bg-slate-50 rounded p-3 text-[11px] border border-slate-200">
                            <span className="font-extrabold text-slate-600 block">ARBITRATOR RESOLUTION NOTES</span>
                            <p className="text-slate-500 mt-1">{dis.resolutionNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB: SELLER HUB & ANALYTICS
              ========================================== */}
          {currentTab === 'seller-dashboard' && (
            <div className="space-y-8">
              
              {/* Analytics metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">Total Store Revenue</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-800">$42,500</span>
                    <span className="text-xs text-emerald-600 font-bold">+18% MoM</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">Transactions Counter</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-800">310 sales</span>
                    <span className="text-xs text-indigo-600 font-bold">+12%</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">Competitor Alert Matrix</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-rose-600">1 Item</span>
                    <span className="text-[10px] text-slate-400 font-medium">Under-sold locally</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">Overall Shop Rating</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-slate-800">4.8</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                </div>

              </div>

              {/* Competitor Price Alerts Grid & Reorder Signals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Competitor Price Tracking & Low Stock Alerts */}
                <div className="space-y-6">
                  
                  {/* Competitor Live Tracking */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-rose-500" /> Live Competitor Price Tracking
                    </h3>
                    <p className="text-xs text-slate-400">
                      Our intelligence crawlers monitor standard merchant indexes to keep you competitive.
                    </p>
                    <div className="space-y-2 text-xs">
                      {products.filter(p => p.competitorPrice).map((p) => {
                        const discount = p.competitorPrice ? Math.round(((p.price - p.competitorPrice) / p.price) * 100) : 0;
                        return (
                          <div key={p.id} className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                            <div>
                              <h4 className="font-bold text-slate-700">{p.title}</h4>
                              <p className="text-[10px] text-slate-400">Your Price: ${p.price} vs Competitor: ${p.competitorPrice}</p>
                            </div>
                            <div>
                              {discount > 0 ? (
                                <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                                  Competitor is {discount}% cheaper!
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                                  You are cheaper!
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Low stock indicators */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500" /> Low Stock Alerts
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-amber-900">Handcrafted Maple Lamp</h4>
                          <span className="text-[10px] text-amber-700">Stock: 3 units left</span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-1 rounded text-[10px]">
                          Suggest reordering 10 units
                        </span>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-amber-900">Vintage Wash Denim Jacket</h4>
                          <span className="text-[10px] text-amber-700">Stock: 2 units left</span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-1 rounded text-[10px]">
                          Suggest reordering 15 units
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sales Heatmaps & 30-Day Forecasting */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
                  <h3 className="font-extrabold text-slate-800 text-sm">30-Day Revenue Forecasting</h3>
                  
                  {/* Forecasting Line graph using recharts */}
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { date: '06-28', Revenue: 1500 },
                        { date: '07-05', Revenue: 1850 },
                        { date: '07-12', Revenue: 2200 },
                        { date: '07-19', Revenue: 2500 },
                        { date: '07-26', Revenue: 2900 }
                      ]}>
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Line type="monotone" dataKey="Revenue" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Heatmap summary data */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sales Heatmap (Peak hours)</span>
                    <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                      <div className="p-2 bg-indigo-50 text-indigo-800 rounded font-bold">Mon<br/>12:00</div>
                      <div className="p-2 bg-indigo-100 text-indigo-800 rounded font-bold">Wed<br/>18:00</div>
                      <div className="p-2 bg-indigo-300 text-white rounded font-bold">Fri<br/>20:00</div>
                      <div className="p-2 bg-indigo-400 text-white rounded font-bold">Sat<br/>14:00</div>
                      <div className="p-2 bg-indigo-500 text-white rounded font-bold">Sun<br/>16:00</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB: AI MULTIMODAL LISTING GENERATOR
              ========================================== */}
          {currentTab === 'create-product' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Creator inputs */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                  <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3">Listing Details Editor</h3>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">CATEGORY</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        >
                          <option value="Home & Living">Home & Living</option>
                          <option value="Apparel">Apparel</option>
                          <option value="Electronics">Electronics</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">STOCK UNITS</label>
                        <input
                          required
                          type="number"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">PRODUCT TITLE</label>
                      <input
                        required
                        type="text"
                        placeholder="AI will generate draft if you click Multimodal Fill..."
                        value={newProdTitle}
                        onChange={(e) => setNewProdTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">SEO DESCRIPTION</label>
                      <textarea
                        required
                        placeholder="Draft or rely on AI Smart Fill..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">PRICE ($)</label>
                        <input
                          required
                          type="number"
                          placeholder="Suggested Price"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">SEARCH TAGS</label>
                        <input
                          type="text"
                          placeholder="handmade, leather, modern"
                          value={newProdTags}
                          onChange={(e) => setNewProdTags(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">LAUNCH IMAGE URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-md"
                    >
                      Publish to Marketplace Catalog
                    </button>
                  </form>
                </div>

                {/* Smart Multimodal Upload Simulation */}
                <div className="space-y-6">
                  
                  <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 space-y-4 shadow-xl border border-indigo-800">
                    <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-300">
                      <Sparkles className="w-4 h-4" /> AI Multimodal Photo Analyzer
                    </h3>
                    
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Pick any of the preset product category images below to simulate uploading a live snapshot of your handmade product.
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => triggerAIDescribe(img.url)}
                          className="bg-white/10 rounded-lg p-1 hover:bg-white/20 transition text-left border border-white/10 flex flex-col items-center"
                        >
                          <img src={img.url} className="w-12 h-12 rounded object-cover mb-1" />
                          <span className="text-[9px] font-bold text-indigo-200 text-center truncate w-full">{img.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-indigo-800/60 flex justify-between items-center">
                      <span className="text-[10px] text-slate-300">Status: Active Vision</span>
                      <button 
                        type="button"
                        onClick={() => triggerAIDescribe()}
                        disabled={isGeneratingListing}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-[10px] px-3 py-2 rounded-lg transition"
                      >
                        {isGeneratingListing ? 'Analyzing...' : 'Smart Fill Draft'}
                      </button>
                    </div>
                  </div>

                  {/* AI Price Suggester Matrix */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-slate-800 text-xs tracking-tight border-b border-slate-100 pb-3 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-indigo-500" /> AI Pricing Recommendation
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">MANUFACTURING BASE COST ($)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={pricingCost}
                            onChange={(e) => setPricingCost(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs font-semibold focus:outline-none w-20"
                          />
                          <button
                            type="button"
                            onClick={triggerPriceSuggest}
                            disabled={isSuggestingPrice}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition"
                          >
                            {isSuggestingPrice ? 'Calculating...' : 'Calculate Optimal Markup'}
                          </button>
                        </div>
                      </div>

                      {priceSuggestion && (
                        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-900">Recommended Selling Price:</span>
                            <span className="text-sm font-extrabold text-indigo-600">${priceSuggestion.suggestedPrice}</span>
                          </div>
                          <p className="text-[10px] text-indigo-700 leading-normal">{priceSuggestion.justification}</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB: BULK CSV LOADER
              ========================================== */}
          {currentTab === 'bulk-upload' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" /> CSV Multi-Listing Upload
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Avoid listing handcraft items manually. Paste a standard formatted comma-separated stock template into the text area below to list bulk entries instantly.
                </p>

                {bulkUploadSuccess && (
                  <div className="p-3 bg-indigo-50 text-indigo-800 font-semibold rounded-lg text-xs border border-indigo-150">
                    {bulkUploadSuccess}
                  </div>
                )}

                <form onSubmit={handleBulkUpload} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">CSV TEXT PLATFORM FORMAT</label>
                    <textarea
                      required
                      placeholder="title,description,price,stock,category,tags,image"
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-indigo-500 transition min-h-[150px]"
                    />
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-[10px] text-slate-500 border border-slate-200">
                    <span className="font-bold block text-slate-600 mb-1">SAMPLE FORMAT:</span>
                    <code>
                      title,description,price,stock,category,tags,image<br />
                      Eco Cotton Sweater,Super comfy knit casual sweater,65,12,Apparel,handmade;vintage,https://images.unsplash.com/...
                    </code>
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition">
                    Bulk Load Items
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: SELLER TRUST & VERIFICATION
              ========================================== */}
          {currentTab === 'seller-verify' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" /> Merchant Verification Submission
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Earn a premium **"Verified Seller"** badge beside your name and products. Upload your business ID license or artisan certificate for manual arbitration review.
                </p>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-800 space-y-1">
                  <h4 className="font-extrabold">Current Verification Status: PENDING MANUAL AUDIT</h4>
                  <p className="text-[10px] text-indigo-700/80">Our platform moderation team holds submissions in order to verify valid seller status.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">DOCUMENT IMAGE LINK</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={verificationDoc}
                      onChange={(e) => setVerificationDoc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <button 
                    onClick={submitVerification}
                    disabled={isSubmittingVerify}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    {isSubmittingVerify ? 'Uploading documents...' : 'Submit Credentials for Review'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: ADMIN DISPUTES MODERATOR
              ========================================== */}
          {currentTab === 'admin-disputes' && (
            <div className="space-y-6">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Escrow claims moderation</h2>
              
              <div className="space-y-4">
                {disputes.map((dis) => (
                  <div key={dis.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-slate-800">Arbitration claim: {dis.id}</span>
                        <p className="text-[10px] text-slate-400">Order Ref: {dis.orderId} | Buyer: {dis.buyerName}</p>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${
                        dis.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {dis.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      Reason given: **{dis.reason}** - {dis.details}
                    </p>

                    {dis.status === 'pending' && (
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => handleResolveDispute(dis.id, 'resolved_refunded', 'Platform approved refund. Money dispatched immediately back to buyers payment account.')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition"
                        >
                          Disburse Refund
                        </button>
                        <button
                          onClick={() => handleResolveDispute(dis.id, 'resolved_dismissed', 'Claim audited and dismissed. Delivery records confirm parcel successfully reached destination.')}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-lg transition"
                        >
                          Dismiss Claim
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: ADMIN VERIFICATIONS MODERATOR
              ========================================== */}
          {currentTab === 'admin-verifications' && (
            <div className="space-y-6">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Artisan credential audits</h2>
              
              <div className="space-y-4">
                {sellers.filter(s => s.verificationStatus === 'pending').map((sel) => (
                  <div key={sel.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">{sel.shopName}</h4>
                        <p className="text-xs text-slate-400">Artisan Owner: {sel.ownerName} (ID Ref: {sel.id})</p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2.5 py-1 rounded-md">
                        PENDING AUDIT
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">SUBMITTED LICENSE PHOTO</span>
                      <div className="w-48 h-32 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                        <img src={sel.verificationDocUrl} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => approveVerification(sel.id, true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition"
                      >
                        Approve Badge
                      </button>
                      <button
                        onClick={() => approveVerification(sel.id, false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-1.5 rounded-lg transition"
                      >
                        Reject Submission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
