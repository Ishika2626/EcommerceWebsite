import { createContext, useContext, ReactNode } from "react";
import { 
  useGetCart, 
  useAddToCart, 
  useUpdateCartItem, 
  useRemoveFromCart,
  useClearCart,
  Cart,
  AddToCartRequest
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: Cart | undefined;
  isLoading: boolean;
  addItem: (item: AddToCartRequest) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isAdding: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: cart, isLoading } = useGetCart({
    query: { retry: false }
  });

  const addMutation = useAddToCart({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData([`/api/cart`], data);
        toast({
          title: "Added to Cart",
          description: "Item successfully added to your shopping cart.",
        });
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Failed to add item",
          description: err.message || "Please try again later.",
        });
      }
    }
  });

  const updateMutation = useUpdateCartItem({
    mutation: {
      onSuccess: (data) => queryClient.setQueryData([`/api/cart`], data),
    }
  });

  const removeMutation = useRemoveFromCart({
    mutation: {
      onSuccess: (data) => queryClient.setQueryData([`/api/cart`], data),
    }
  });

  const clearMutation = useClearCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/cart`] }),
    }
  });

  const value = {
    cart,
    isLoading,
    addItem: async (item: AddToCartRequest) => { await addMutation.mutateAsync({ data: item }); },
    updateQuantity: async (productId: number, quantity: number) => { 
      await updateMutation.mutateAsync({ productId, data: { quantity } }); 
    },
    removeItem: async (productId: number) => { await removeMutation.mutateAsync({ productId }); },
    clearCart: async () => { await clearMutation.mutateAsync(); },
    isAdding: addMutation.isPending,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartStore() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartStore must be used within a CartProvider");
  }
  return context;
}
