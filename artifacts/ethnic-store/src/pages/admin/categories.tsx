import { AdminLayout } from "@/components/admin-layout";
import { useListCategories, useCreateCategory, useDeleteCategory } from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Folder } from "lucide-react";

export default function AdminCategories() {
  const { data: categories, isLoading } = useListCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const createMutation = useCreateCategory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/categories`] });
        setName(""); setDesc("");
        toast({ title: "Category added" });
      }
    }
  });

  const deleteMutation = useDeleteCategory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/categories`] });
        toast({ title: "Category deleted" });
      }
    }
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: { name, description: desc } });
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete category?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required value={name} onChange={e=>setName(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-xl focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-xl focus:border-primary outline-none" />
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-border">
              {isLoading ? <li className="p-6 text-center">Loading...</li> : categories?.map(cat => (
                <li key={cat.id} className="p-6 flex items-center justify-between hover:bg-muted/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Folder className="w-6 h-6"/></div>
                    <div>
                      <h3 className="font-bold text-foreground">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
