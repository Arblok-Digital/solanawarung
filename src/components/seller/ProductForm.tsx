import React, { useState } from 'react';
import { Camera, Loader2, CheckCircle2, Type, Tag, DollarSign, Package, X, Sparkles, Upload } from 'lucide-react';
import { analyzeProductImage } from '../../services/gemini/vision';
import { uploadImage } from '../../services/firebase/storage';

interface ProductFormProps {
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSave, onClose }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = preview;
      if (preview && preview.startsWith('data:image')) {
        const filename = `products/${Date.now()}.jpg`;
        imageUrl = await uploadImage(preview, filename);
      }
      await onSave({ ...productData, imageUrl });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Tambah Produk Baru</h3>
              <p className="text-[11px] text-slate-400 font-medium">Upload foto dan biarkan AI mengisi datanya.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-2 hover:bg-slate-100 rounded-xl">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Foto Produk</label>
            <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-dashed border-slate-200 hover:border-blue-300 flex items-center justify-center overflow-hidden group transition-all cursor-pointer">
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                  {analyzing && (
                    <div className="absolute inset-0 bg-[#0c111d]/70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <div className="relative mb-4">
                        <BrainIcon />
                      </div>
                      <span className="font-bold text-sm">Gemini sedang menganalisis...</span>
                      <span className="text-slate-300 text-xs mt-1">Mendeteksi nama, kategori, dan harga</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <Upload size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-slate-500 text-sm font-bold mb-1">Klik atau drag foto produk</p>
                  <p className="text-slate-300 text-xs">AI akan otomatis mengisi detail produk Anda</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Type size={10} /> Nama Produk
              </label>
              <input 
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({...productData, name: e.target.value})}
                placeholder="Sambal Bawang Spesial"
                className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium text-sm placeholder:text-slate-300"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Tag size={10} /> Kategori
              </label>
              <select 
                value={productData.category}
                onChange={(e) => setProductData({...productData, category: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium text-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Pakaian">Pakaian</option>
                <option value="Kerajinan">Kerajinan</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign size={10} /> Harga (CBDC)
              </label>
              <input 
                type="number"
                value={productData.price}
                onChange={(e) => setProductData({...productData, price: Number(e.target.value)})}
                className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium text-sm font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Package size={10} /> Stok
              </label>
              <input 
                type="number"
                value={productData.stock}
                onChange={(e) => setProductData({...productData, stock: Number(e.target.value)})}
                className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium text-sm font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi</label>
            <textarea 
              value={productData.description}
              onChange={(e) => setProductData({...productData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium text-sm resize-none placeholder:text-slate-300"
              placeholder="Ceritakan keunikan produk Anda..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3.5 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={saving || analyzing}
              className="flex-[2] py-3.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              {(saving || analyzing) ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Gelar Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function BrainIcon() {
  return (
    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/30">
      <Sparkles className="text-white" size={24} />
    </div>
  );
}
