import { AdminLayout } from "@/components/admin-layout";
import { useListProducts, useDeleteProduct } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const { data, isLoading } = useListProducts({ params: { limit: 100 } });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useDeleteProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/products`] });
        toast({ title: "Product deleted" });
      }
    }
  });

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
        <Link href="/admin/products/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
              ) : data?.products.map(product => (
                <tr key={product.id} className="hover:bg-muted/20">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded object-cover border border-border" />
                    <span className="font-medium line-clamp-1">{product.name}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{product.categoryName}</td>
                  <td className="p-4 font-semibold">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.isActive ? <span className="text-green-600">Active</span> : <span className="text-muted-foreground">Inactive</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
