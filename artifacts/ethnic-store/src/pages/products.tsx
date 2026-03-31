import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { useSearch } from "wouter";
import { Search, Filter, SlidersHorizontal, Loader2, PackageX } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const PAGE_SIZE = 12;

export default function Products() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");
  const [category, setCategory] = useState<number | undefined>(
    params.get("category") ? Number(params.get("category")) : undefined
  );
  const [sort, setSort] = useState<any>(params.get("sort") || "newest");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtersKey = `${searchTerm}|${category ?? ""}|${sort}`;
  const prevFiltersKey = useRef(filtersKey);

  const { data, isLoading, isFetching } = useListProducts({
    params: { search: searchTerm || undefined, category, sort, limit: PAGE_SIZE, page },
  });

  // When filters change reset pagination
  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setPage(1);
      setAllProducts([]);
      setTotal(0);
      setTotalPages(1);
    }
  }, [filtersKey]);

  // Accumulate products across pages
  useEffect(() => {
    if (!data?.products) return;
    setTotal(data.total ?? 0);
    setTotalPages(data.totalPages ?? 1);
    if (page === 1) {
      setAllProducts(data.products as any[]);
    } else {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const fresh = (data.products as any[]).filter((p) => !existingIds.has(p.id));
        return [...prev, ...fresh];
      });
    }
  }, [data, page]);

  const hasMore = page < totalPages;

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Sync filters to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const urlParams = new URLSearchParams();
      if (searchTerm) urlParams.set("search", searchTerm);
      if (category) urlParams.set("category", category.toString());
      if (sort) urlParams.set("sort", sort);
      window.history.replaceState(null, "", `?${urlParams.toString()}`);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, category, sort]);

  const { data: categoriesData } = useListCategories();

  return (
    <Layout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-primary mb-4">Our Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover pieces that blend traditional artistry with modern elegance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-foreground">
                <Filter className="w-4 h-4" /> Categories
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={!category}
                    onChange={() => setCategory(undefined)}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    All Categories
                  </span>
                </label>
                {categoriesData?.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <p className="text-sm font-medium text-muted-foreground">
                Showing{" "}
                <span className="text-foreground font-semibold">{allProducts.length}</span> of{" "}
                <span className="text-foreground font-semibold">{total}</span> products
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="popular">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading && page === 1 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : allProducts.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <PackageX className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setSearchTerm(""); setCategory(undefined); setSort("newest"); }}
                  className="mt-6 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-10 mt-2" />

                {isFetching && page > 1 && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-7 h-7 animate-spin text-primary" />
                  </div>
                )}

                {!hasMore && allProducts.length > 0 && (
                  <p className="text-center text-muted-foreground text-sm py-6 border-t border-border mt-4">
                    You&apos;ve seen all {total} products
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
