"use client";

import { Button } from "@/components/ui/button";
import { useMarketplace } from "@/hooks/useMarketplace";
import { MarketPlaceProductCard } from "./components/ProductCard";
import SearchBar from "./components/SearchBar";
import CategoryFilters from "./components/CategoryFilters";
import { LoadingCard } from "@/components/ui/Loading";
import SortSelector from "./components/SortSelector";
import { ProductResponseDTO } from "@/types/DTO/MarketPlaceDTO";
import ProductDialog from "./ProductDialog";
import { useCartStore } from "@/stores/cartStore";
import { productToCartItem } from "./helpers";

export default function MarketPlacePage() {
  const {
    products,
    total,
    loading,
    filters,
    setFilters,
    loadMore,
    setSelectedProduct,
    setOpenDialog,
    openDialog,
    selectedProduct,
  } = useMarketplace();
  const addItem = useCartStore((state) => state.addItem);

  const handleLoadMore = () => {
    loadMore();
  };

  const handleOpenDialog = (product: ProductResponseDTO) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleAddToCart = (selectedProduct: ProductResponseDTO, quantity: number) => {
    if (!selectedProduct) return;
    const convertedCartItem = productToCartItem(selectedProduct, quantity);
    addItem(convertedCartItem);
  };

  return (
    <div className="max-w-7xl mx-auto h-full w-full">
      <ProductDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedProduct={selectedProduct}
        addProductToCart={(quantity: number) => handleAddToCart(selectedProduct!, quantity)}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text1)] mb-2">Market Place</h1>
        <p className="text-[var(--text2)]">Discover and purchase amazing mods for your vehicle</p>
      </div>

      <SearchBar setSearch={(searchQuery) => setFilters({ search: searchQuery })} />
      <CategoryFilters
        setCategory={(category) => setFilters({ category: category })}
        selectedCategory={filters.category ?? ""}
        loading={loading}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-[var(--text2)]">
          Showing {products.length} out of {total} results
        </div>
        <SortSelector filters={filters} setFilters={setFilters} />
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full min-h-[600px]">
          {[1, 2, 3, 4].map((item) => (
            <LoadingCard key={item} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--text1)] mb-2">No products found</p>
            <p className="text-[var(--text2)]">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12 w-full min-h-[600px]">
          {products.map((item) => (
            <MarketPlaceProductCard
              key={item.id}
              product={item}
              handleOpenDialog={() => handleOpenDialog(item)}
            />
          ))}
        </div>
      )}

      {products.length > 0 && products.length < total && (
        <div className="text-center w-full py-12">
          <Button
            variant="outline"
            className="px-8 py-3"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Items"}
          </Button>
        </div>
      )}
    </div>
  );
}
