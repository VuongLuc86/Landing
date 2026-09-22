import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomerProfile } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>, openCart?: boolean) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  totalPrice: number;
  totalOriginalPrice: number;
  totalSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartAnimationKey: number;
  openCheckoutWithItem: (item: Omit<CartItem, 'id'>) => void;
  checkoutStep: 'cart' | 'checkout' | 'success';
  setCheckoutStep: (step: 'cart' | 'checkout' | 'success') => void;
  customerProfile: CustomerProfile;
  saveCustomerProfile: (profile: Partial<CustomerProfile>) => void;
  lastCreatedOrder: any;
  setLastCreatedOrder: (order: any) => void;
}

const defaultProfile: CustomerProfile = {
  fullName: '',
  phone: '',
  province: '',
  district: '',
  address: '',
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hunonic_cart_items_v2';
const PROFILE_STORAGE_KEY = 'hunonic_customer_profile_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading cart from localStorage', e);
    }
    // Default initial item if cart was empty so user sees realistic cart immediately
    return [
      {
        id: 'switch-luxury-rect-4-black',
        productId: 'switch-luxury',
        name: 'Công Tắc Cảm Ứng Hunonic Luxury',
        category: 'Công tắc thông minh',
        price: 730000,
        originalPrice: 895000,
        imageUrl: '/images/hunonic/hunonic-cam-ung.jpg',
        shape: 'Đế Chữ nhật',
        gangs: 4,
        color: 'Đen Huyền Bí',
        quantity: 1,
        warranty: '24 Tháng (1 Đổi 1)',
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [cartAnimationKey, setCartAnimationKey] = useState<number>(0);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any>(null);

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        return { ...defaultProfile, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error reading customer profile', e);
    }
    return defaultProfile;
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Persist customer profile
  const saveCustomerProfile = (profile: Partial<CustomerProfile>) => {
    setCustomerProfile((prev) => {
      const updated = { ...prev, ...profile };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const addToCart = (newItem: Omit<CartItem, 'id'>, openCart = true) => {
    // Generate an ID based on product characteristics
    const shapeStr = newItem.shape || '';
    const gangsStr = newItem.gangs ? `${newItem.gangs}` : '';
    const colorStr = newItem.color || '';
    const generatedId = `${newItem.productId}-${shapeStr}-${gangsStr}-${colorStr}`.replace(/\s+/g, '-').toLowerCase();

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === generatedId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (newItem.quantity || 1),
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...newItem,
            id: generatedId,
            quantity: newItem.quantity || 1,
          },
        ];
      }
    });

    setCartAnimationKey((prev) => prev + 1);

    if (openCart) {
      setCheckoutStep('cart');
      setIsCartOpen(true);
    }
  };

  const openCheckoutWithItem = (newItem: Omit<CartItem, 'id'>) => {
    addToCart(newItem, false);
    setCheckoutStep('checkout');
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const totalSavings = Math.max(0, totalOriginalPrice - totalPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalPrice,
        totalOriginalPrice,
        totalSavings,
        isCartOpen,
        setIsCartOpen,
        cartAnimationKey,
        openCheckoutWithItem,
        checkoutStep,
        setCheckoutStep,
        customerProfile,
        saveCustomerProfile,
        lastCreatedOrder,
        setLastCreatedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
