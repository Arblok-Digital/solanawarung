import React, { useState } from 'react';
import { analyzeProductImage } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/auth';
import { 
  Plus, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  Package,
  Tag,
  DollarSign,
  Type
} from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 10,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setAnalyzing(true);
      try {
        const result = await analyzeProductImage(base64);
        setProductData({
          name: result.name || '',
          category: result.category || '',
          description: result.description || '',
          price: result.estimatedPrice || 0,
          stock: 10,
        });
      } catch (error) {
        console.error('Gemini error:', error);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...productData,
        sellerId: user.uid,
        imageUrl: preview, // Storage is not setup yet, using base64 for demo as per common shortcut
        createdAt: serverTimestamp(),
      });
      setShowAddProduct(false);
      setPreview(null);
      setProductData({ name: '', category: '', description: '', price: 0, stock: 10 });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Produk</h2>
          <p className="text-slate-500">Kelola dan tambah produk UMKM Anda dengan bantuan AI.</p>
        </div>
        <button 
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Plus className="text-blue-600" />
                Tambah Produk Baru
              </h3>
              <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Image Section */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest block">Foto Produk</label>
                <div className="relative aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center p-4 overflow-hidden group">
                  {preview ? (
                    <>
                      <img src={preview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
                      {analyzing && (
                        <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                          <Loader2 className="animate-spin mb-3" size={32} />
                          <span className="font-bold">Gemini is analyzing...</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 text-sm mb-4">Click below to upload a photo</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} /> Nama Produk
                  </label>
                  <input 
                    type="text"
                    value={productData.name}
                    onChange={(e) => setProductData({...productData, name: e.target.value})}
                    placeholder="Contoh: Sambal Bawang Spesial"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Kategori
                  </label>
                  <select 
                    value={productData.category}
                    onChange={(e) => setProductData({...productData, category: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Makanan dan Minuman">Makanan dan Minuman</option>
                    <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={14} /> Harga (CBDC)
                  </label>
                  <input 
                    type="number"
                    value={productData.price}
                    onChange={(e) => setProductData({...productData, price: Number(e.target.value)})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={14} /> Stok
                  </label>
                  <input 
                    type="number"
                    value={productData.stock}
                    onChange={(e) => setProductData({...productData, stock: Number(e.target.value)})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi</label>
                <textarea 
                  value={productData.description}
                  onChange={(e) => setProductData({...productData, description: e.target.value})}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                  placeholder="Ceritakan tentang keunikan produk Anda..."
                  required
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 py-4 px-6 border-2 border-slate-100 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={saving || analyzing}
                  className="flex-3 py-4 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                  Gelar Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Placeholder for Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center opacity-60">
           <Package size={48} className="text-slate-300 mb-4" />
           <p className="text-slate-400 font-medium">Belum ada produk.<br/>Klik tombol di atas untuk memulai.</p>
        </div>
      </div>
    </div>
  );
}

function XCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  );
}
