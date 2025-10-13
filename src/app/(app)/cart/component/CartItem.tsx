import { CartItemDTO } from "@/types/DTO/MarketPlaceDTO";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemDTO;
  index: number;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  isLoading: boolean;
  formatPrice: (cents: number) => string;
}

export default function CartItem({
  item,
  index,
  updateQuantity,
  removeItem,
  isLoading,
  formatPrice,
}: CartItemProps) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 hover:bg-[var(--bg-dark2)] transition-colors"
    >
      <div className="grid grid-cols-16 gap-4 items-center">
        <div className="col-span-2">
          <div className="w-20 h-20 bg-[var(--bg-dark2)] rounded-lg overflow-hidden">
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="col-span-8">
          <h3 className="font-semibold text-[var(--text1)] mb-1 text-wrap">{item.productName}</h3>
          <div className="text-md font-bold text-[var(--text1)] mt-2">
            {formatPrice(item.unitPriceCents)}
          </div>
        </div>

        <div className="col-span-4 flex items-center justify-center gap-3">
          <div className="flex items-center bg-[var(--bg-dark2)] rounded-lg border border-[var(--bg-dark1)]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[var(--bg-dark1)]"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={isLoading}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm font-medium text-[var(--text1)] min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[var(--bg-dark1)]"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[var(--text2)] hover:text-red-400 hover:bg-red-400/10"
            onClick={() => removeItem(item.id)}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="col-span-2">
          <div className="text-lg font-bold text-[var(--highlight)]">
            {formatPrice(item.totalPriceCents)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
