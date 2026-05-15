import React, { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp, Boxes } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createProduct, updateProduct, subscribeToSellerProducts, deleteProduct } from '../../services/firebase/products';
import { Product } from '../../types';
import { ProductGrid } from './ProductGrid';
import { ProductForm } from './ProductForm';

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToSellerProducts(user.uid, (data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleSaveProduct = async (productData: any) => {
    if (!user) return;
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct({
          ...productData,
          sellerId: user.uid,
        });
      }
      setShowAddProduct(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="p-8 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
        <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-200 text-[11px] font-bold uppercase tracking-widest">Total Produk</span>
            <Package size={18} className="text-blue-200" />
          </div>
          <p className="text-3xl font-black">{products.length}</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl text-white shadow-lg shadow-purple-600/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-200 text-[11px] font-bold uppercase tracking-widest">Total Stok</span>
            <Boxes size={18} className="text-purple-200" />
          </div>
          <p className="text-3xl font-black">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-widest">Nilai Inventori</span>
            <TrendingUp size={18} className="text-emerald-200" />
          </div>
          <p className="text-3xl font-black">{totalValue.toLocaleString()} <span className="text-base font-bold text-emerald-200">CBDC</span></p>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Katalog Produk</h2>
          <p className="text-slate-400 text-sm">Kelola dan tambah produk UMKM Anda dengan bantuan AI.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setShowAddProduct(true);
          }}
          aria-label="Tambah Produk Baru"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-sm transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          <Plus size={18} />
          Tambah Produk
        </button>
      </div>

      <ProductGrid 
        products={products} 
        onEdit={(p) => {
          setEditingProduct(p);
          setShowAddProduct(true);
        }}
        onDelete={handleDeleteProduct}
        loading={loading}
      />

      {showAddProduct && (
        <ProductForm 
          product={editingProduct || undefined}
          onSave={handleSaveProduct} 
          onClose={() => { setShowAddProduct(false); setEditingProduct(null); }} 
        />
      )}
    </div>
  );
};
