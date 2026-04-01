import { AdminLayout } from "@/components/admin-layout";
import { useCreateProduct, useUpdateProduct, useGetProduct, useListCategories, useUploadImage } from "@workspace/api-client-react";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

export default function AdminProductForm() {
  const [match, params] = useRoute("/admin/products/:id/edit");
  const isEdit = !!match;
  const id = Number(params?.id);
  
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useListCategories();
  const { data: existingProduct, isLoading: isLoadingProduct } = useGetProduct(id, { query: { enabled: isEdit } });
  const uploadMutation = useUploadImage();
  
  const createMutation = useCreateProduct({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: [`/api/products`] }); setLocation("/admin/products"); toast({ title: "Product created" }); } }
  });
  
  const updateMutation = useUpdateProduct({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: [`/api/products`] }); setLocation("/admin/products"); toast({ title: "Product updated" }); } }
  });

  const [formData, setFormData] = useState({
    name: "", sku: "", description: "", price: "", originalPrice: "", categoryId: "", stock: "10",
    isActive: true, isFeatured: false, isCodAvailable: true
  });
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string>("");
  const [colors, setColors] = useState<string>("");

  useEffect(() => {
    if (isEdit && existingProduct) {
      setFormData({
        name: existingProduct.name,
        sku: (existingProduct as any).sku || "",
        description: existingProduct.description || "",
        price: existingProduct.price.toString(),
        originalPrice: existingProduct.originalPrice?.toString() || "",
        categoryId: existingProduct.categoryId.toString(),
        stock: existingProduct.stock.toString(),
        isActive: existingProduct.isActive ?? true,
        isFeatured: existingProduct.isFeatured ?? false,
        isCodAvailable: (existingProduct as any).isCodAvailable ?? true,
      });
      setImages(existingProduct.images || []);
      setSizes(existingProduct.sizes?.join(", ") || "");
      setColors(existingProduct.colors?.join(", ") || "");
    }
  }, [isEdit, existingProduct]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    
    // In a real app we might Promise.all this, but doing sequentially to show progress or simply one by one is fine for this demo
    for(const file of files) {
      try {
        const res = await uploadMutation.mutateAsync({ data: { image: file } });
        setImages(prev => [...prev, res.url]);
      } catch (err) {
        toast({ variant: "destructive", title: "Upload failed" });
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({ variant: "destructive", title: "At least one image is required" });
      return;
    }

    const payload = {
      name: formData.name,
      sku: formData.sku || undefined,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      categoryId: Number(formData.categoryId),
      stock: Number(formData.stock),
      images,
      sizes: sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: colors.split(",").map(s => s.trim()).filter(Boolean),
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      isCodAvailable: formData.isCodAvailable,
    } as any;

    if (isEdit) {
      updateMutation.mutate({ id, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  if (isEdit && isLoadingProduct) return <AdminLayout><div className="p-10">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-border">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product SKU / ID <span className="text-muted-foreground font-normal">(e.g. VV-0360)</span></label>
                <input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. VV-0360" className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price (₹)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price (₹) - For Discounts</label>
                <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option value="">Select Category</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-border">Product Images</h2>
            
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadMutation.isPending ? <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" /> : <Upload className="w-8 h-8 text-primary mb-2" />}
                  <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> multiple photos</p>
                </div>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadMutation.isPending} />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((url, i) => (
                  <div key={i} className="relative group aspect-[3/4] bg-muted rounded-xl border border-border overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute bottom-2 left-2 text-[10px] bg-primary text-white px-2 py-1 rounded font-bold">MAIN</span>}
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-border">Variants & Visibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
                <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="e.g. S, M, L, XL" className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
                <input value={colors} onChange={e => setColors(e.target.value)} placeholder="e.g. Red, Blue, #FF0000" className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary outline-none" />
              </div>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                  Active (Visible on store)
                </label>
              </div>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                  Featured on Homepage
                </label>
              </div>
              <div className="md:col-span-2 pt-2">
                <p className="text-sm font-semibold mb-3">Cash on Delivery (COD)</p>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer flex-1 transition-colors ${formData.isCodAvailable ? "border-green-500 bg-green-50" : "border-border"}`}>
                    <input
                      type="radio"
                      name="codAvailable"
                      checked={formData.isCodAvailable}
                      onChange={() => setFormData({...formData, isCodAvailable: true})}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <p className="font-medium text-sm text-green-800">COD Available</p>
                      <p className="text-xs text-green-600">₹200 extra per item for COD</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer flex-1 transition-colors ${!formData.isCodAvailable ? "border-orange-500 bg-orange-50" : "border-border"}`}>
                    <input
                      type="radio"
                      name="codAvailable"
                      checked={!formData.isCodAvailable}
                      onChange={() => setFormData({...formData, isCodAvailable: false})}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <p className="font-medium text-sm text-orange-800">Advance Only</p>
                      <p className="text-xs text-orange-600">Online payment required</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg">
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Product"}
            </button>
            <button type="button" onClick={() => setLocation("/admin/products")} className="px-8 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
