import React, { useState } from 'react';
import { Camera, Loader2, CheckCircle2, Type, Tag, DollarSign, Package, X, Sparkles, Upload } from 'lucide-react';
import { analyzeProductImage } from '../../services/gemini/vision';
import { uploadImage } from '../../services/firebase/storage';

interface ProductFormProps {
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSave, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
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
      setImagePreview(base64);
      setIsAnalyzing(true);
      try {
        // AI as Co-Pilot: Gemini menganalisis foto untuk mengisi draf form
        const result = await analyzeProductImage(base64);
        setFormData({
          name: result.name || '',
          category: result.category || 'Makanan',
          description: result.description || '',
          price: result.estimatedPrice || 0,
          stock: 10,
        });
      } catch (error) {
        console.error('AI Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl = imagePreview;
      if (imagePreview && imagePreview.startsWith('data:image')) {
        const filename = `products/${Date.now()}.jpg`;
        imageUrl = await uploadImage(imagePreview, filename);
      }
      await onSave({ ...formData, imageUrl });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0c111d]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Tambah Produk</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Asisten AI Siap Membantu</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto relative">
          {/* AI Analyzing Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-blue-600 animate-pulse" size={32} />
                </div>
              </div>
              <h4 className="text-lg font-black text-slate-800 mb-2">Gemini Sedang Mengamati...</h4>
              <p className="text-sm text-slate-500 max-w-[280px]">Mengenali detail produk untuk mengisi formulir secara otomatis.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Foto Section */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Camera size={14} /> Foto Produk <span className="text-blue-600">*</span>
              </label>
              
              <div 
                onClick={() => !isAnalyzing && !isSaving && document.getElementById('image-input')?.click()}
                className={`aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer relative group overflow-hidden
                  ${imagePreview ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'}`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white px-5 py-2.5 rounded-2xl text-xs font-black text-slate-800 flex items-center gap-2 shadow-xl">
                        <Upload size={14} /> Ganti Foto
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload size={28} />
                    </div>
                    <p className="font-black text-slate-700 mb-1">Klik Untuk Upload</p>
                    <p className="text-xs text-slate-400">Pilih foto produk yang jelas & terang</p>
                  </div>
                )}
                <input 
                  id="image-input"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Type size={14} /> Nama Produk
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Kopi Gayo Premium"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Tag size={14} /> Kategori
                </label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Kerajinan">Kerajinan Tangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <DollarSign size={14} /> Harga (Digital Rupiah)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">Rp</span>
                  <input 
                    type="number"
                    required
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-slate-800"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Package size={14} /> Stok Barang
                </label>
                <input 
                  type="number"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Type size={14} /> Deskripsi Produk
              </label>
              <textarea 
                rows={4}
                required
                placeholder="Ceritakan sejarah atau keunggulan produk Anda..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSaving || isAnalyzing}
                className="flex-[2] py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {isSaving ? (
                  <><Loader2 className="animate-spin" size={18} /> Menyimpan...</>
                ) : (
                  <><CheckCircle2 size={18} /> Gelar Dagangan Sekarang</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
