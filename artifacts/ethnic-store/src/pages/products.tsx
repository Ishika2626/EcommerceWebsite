import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { useSearch } from "wouter";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Products() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");
  const [category, setCategory] = useState<number | undefined>(params.get("category") ? Number(params.get("category")) : undefined);
  const [sort, setSort] = useState<any>(params.get("sort") || "newest");
  
  const { data, isLoading } = useListProducts({
    params: {
      search: searchTerm || undefined,
      category,
      sort,
      limit: 12
    }
  });

  const { data: categories } = useListCategories();

  // Simple debounced search
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
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">All Categories</span>
                </label>
                {categories?.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <p className="text-sm font-medium text-muted-foreground">
                Showing {data?.products.length || 0} of {data?.total || 0} products
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

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : data?.products.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setCategory(undefined); }}
                  className="mt-6 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
