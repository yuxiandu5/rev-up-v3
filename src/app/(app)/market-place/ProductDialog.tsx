"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import Image from "next/image";
import { ShoppingCart, TrendingUp, Gauge, Zap, Calendar, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  selectedProduct: ProductResponseDTO | null;
  addProductToCart: (quantity: number) => void;
}

export default function ProductDialog({
  openDialog,
  setOpenDialog,
  selectedProduct,
  addProductToCart,
}: ProductDialogProps) {
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addProductToCart(quantity);
    setQuantity(1);
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <AnimatePresence>
      {openDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[var(--bg-dark3)] rounded-lg shadow-2xl border border-[var(--bg-dark1)] w-full max-w-[70vw] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-[var(--bg-dark1)]">
              <div className="flex-1 pr-8">
                <h2 className="text-3xl font-bold text-[var(--text1)] mb-3">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge variant="outline" className="text-[var(--text2)]">
                    {selectedProduct.mod.category}
                  </Badge>
                  {selectedProduct.mod.brand && (
                    <Badge variant="outline" className="text-[var(--text2)]">
                      {selectedProduct.mod.brand}
                    </Badge>
                  )}
                </div>
                <div className="text-4xl font-bold text-[var(--highlight)]">
                  {selectedProduct.price.formatted}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-3 text-[var(--text2)] hover:text-[var(--text1)] hover:bg-[var(--bg-dark1)] rounded-md transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-[var(--bg-dark2)] rounded-lg overflow-hidden border border-[var(--bg-dark1)] h-[300px] flex items-center justify-center">
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      width={400}
                      height={300}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text1)] mb-2">Description</h3>
                    <p className="text-[var(--text2)] leading-relaxed text-sm">
                      {selectedProduct.description || "No description available."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedProduct.compatibility && (
                    <div className="bg-[var(--bg-dark2)] rounded-lg p-4 border border-[var(--bg-dark1)]">
                      <h3 className="text-lg font-semibold text-[var(--text1)] mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--highlight)]" />
                        Compatible Vehicle
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[var(--text2)]">Vehicle</span>
                          <span className="text-[var(--text1)] font-medium text-right">
                            {selectedProduct.compatibility.make}{" "}
                            {selectedProduct.compatibility.model}{" "}
                            {selectedProduct.compatibility.badge}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[var(--text2)]">Year Range</span>
                          <span className="text-[var(--text1)] font-medium">
                            {selectedProduct.compatibility.yearRange}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProduct.compatibility &&
                    (selectedProduct.compatibility.hpGain ||
                      selectedProduct.compatibility.nmGain ||
                      selectedProduct.compatibility.zeroToHundredDelta ||
                      selectedProduct.compatibility.handlingDelta) && (
                      <div className="bg-[var(--bg-dark2)] rounded-lg p-4 border border-[var(--bg-dark1)]">
                        <h3 className="text-lg font-semibold text-[var(--text1)] mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[var(--green)]" />
                          Performance Gains
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProduct.compatibility.hpGain && (
                            <div className="bg-[var(--bg-dark3)] p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Gauge className="w-4 h-4 text-[var(--highlight)]" />
                                <div className="text-xs text-[var(--text2)]">HP Gain</div>
                              </div>
                              <div className="text-xl font-bold text-[var(--green)]">
                                +{selectedProduct.compatibility.hpGain}
                              </div>
                            </div>
                          )}
                          {selectedProduct.compatibility.nmGain && (
                            <div className="bg-[var(--bg-dark3)] p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-4 h-4 text-[var(--highlight)]" />
                                <div className="text-xs text-[var(--text2)]">Torque (Nm)</div>
                              </div>
                              <div className="text-xl font-bold text-[var(--green)]">
                                +{selectedProduct.compatibility.nmGain}
                              </div>
                            </div>
                          )}
                          {selectedProduct.compatibility.zeroToHundredDelta && (
                            <div className="bg-[var(--bg-dark3)] p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-[var(--highlight)]" />
                                <div className="text-xs text-[var(--text2)]">0-100 km/h</div>
                              </div>
                              <div className="text-xl font-bold text-[var(--green)]">
                                {selectedProduct.compatibility.zeroToHundredDelta > 0 ? "+" : ""}
                                {selectedProduct.compatibility.zeroToHundredDelta}s
                              </div>
                            </div>
                          )}
                          {selectedProduct.compatibility.handlingDelta && (
                            <div className="bg-[var(--bg-dark3)] p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Gauge className="w-4 h-4 text-[var(--highlight)]" />
                                <div className="text-xs text-[var(--text2)]">Handling</div>
                              </div>
                              <div className="text-xl font-bold text-[var(--green)]">
                                {selectedProduct.compatibility.handlingDelta > 0 ? "+" : ""}
                                {selectedProduct.compatibility.handlingDelta}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--bg-dark1)] p-6 bg-[var(--bg-dark2)]">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 bg-[var(--bg-dark3)] rounded-lg border border-[var(--bg-dark1)] px-6 py-3">
                  <span className="text-base font-medium text-[var(--text1)]">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0 text-lg"
                    >
                      -
                    </Button>
                    <span className="text-[var(--text1)] font-bold text-xl min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 p-0 text-lg"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="h-12 px-8 text-base">
                    Close
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      !selectedProduct.isActive ||
                      (selectedProduct.stock !== null && selectedProduct.stock < 1)
                    }
                    className="h-12 px-8 text-base bg-[var(--highlight)] hover:bg-[var(--highlight)]/90 text-white font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
