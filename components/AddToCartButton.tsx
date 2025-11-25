"use client";

import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart!");
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
      <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-accent hover:bg-accent/10 transition-colors">
        <Heart className="w-5 h-5 text-gray-600" />
      </button>
      <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-primary hover:bg-primary/10 transition-colors">
        <Share2 className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

