import { ProductResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function MarketPlaceProductCard({ product }: { product: ProductResponseDTO }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--bg-dark2)] border border-[var(--bg-dark3)] rounded-lg overflow-hidden hover:border-[var(--highlight)] transition-all duration-200 group h-full flex flex-col cursor-pointer"
      onClick={() => {
        toast.message("Dialog Opened!");
      }}
    >
      <div className="aspect-square bg-[var(--bg-dark3)] flex items-center justify-center flex-shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-[var(--text1)] mb-2 group-hover:text-[var(--highlight)] transition-colors h-6 overflow-hidden">
          <span className="line-clamp-1">{product.name}</span>
        </h3>

        <p className="text-sm text-[var(--text2)] mb-3 h-10 overflow-hidden">
          <span className="line-clamp-2">{product.description}</span>
        </p>

        <div className="flex items-center justify-between mb-3 h-6">
          <div className="text-lg font-bold text-[var(--highlight)] truncate">
            {product.price.formatted}
          </div>
          <div className="text-sm text-[var(--text2)] truncate ml-2">{product.mod.category}</div>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--text2)] mb-4 h-5">
          <span className="truncate">Seller: {product.mod.brand}</span>
        </div>
      </div>
    </motion.div>
  );
}
