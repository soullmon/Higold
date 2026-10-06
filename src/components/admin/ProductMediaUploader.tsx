import React, { useState, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Video, Ruler, Trash2, Plus, 
  ExternalLink, Check, Play, Pause, Maximize2, 
  ArrowLeft, ArrowRight, Star, Film, Eye, RefreshCw, X, AlertCircle
} from 'lucide-react';
import { ProductMediaItem, MediaItemType } from '../../types';
import { getProductMediaItems, syncMediaFields } from '../../utils/media';

interface ProductMediaUploaderProps {
  imageUrl?: string;
  onChangeImageUrl: (url: string) => void;
  galleryImages?: string[];
  onChangeGalleryImages: (images: string[]) => void;
  videoUrl?: string;
  onChangeVideoUrl: (url: string) => void;
  dimensionImageUrl?: string;
  onChangeDimensionImageUrl: (url: string) => void;
  mediaList?: ProductMediaItem[];
  onChangeMediaList?: (items: ProductMediaItem[]) => void;
  productName?: string;
  productSku?: string;
}

// Curated high-fidelity architectural kitchen hardware media samples
const SAMPLE_PRESETS: ProductMediaItem[] = [
  {
    id: 'sample-p1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    title: 'Foto Utama - Perspektif Kabinet Dapur',
  },
  {
    id: 'sample-p2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    title: 'Foto Sudut Terbuka - Baki Logam Berlian',
  },
  {
    id: 'sample-v1',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Video Demonstrasi Mekanik Soft-Close',
  },
  {
    id: 'sample-p3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    title: 'Foto Detail Finishing Titanium Grey',
  },
  {
    id: 'sample-d1',
    type: 'dimension',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    title: 'Skema Arsitektural Dimensi & Rel Hidrolik',
  },
];

export const ProductMediaUploader: React.FC<ProductMediaUploaderProps> = ({
  imageUrl = '',
  onChangeImageUrl,
  galleryImages = [],
  onChangeGalleryImages,
  videoUrl = '',
  onChangeVideoUrl,
  dimensionImageUrl = '',
  onChangeDimensionImageUrl,
  mediaList: initialMediaList,
  onChangeMediaList,
  productName = 'Produk',
  productSku = 'HGD',
}) => {
  // Construct initial unified list
  const [items, setItems] = useState<ProductMediaItem[]>(() => {
    if (initialMediaList && initialMediaList.length > 0) {
      return initialMediaList;
    }
    return getProductMediaItems({
      imageUrl,
      galleryImages,
      videoUrl,
      dimensionImageUrl,
    });
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlTypeInput, setUrlTypeInput] = useState<MediaItemType>('image');
  const [urlTitleInput, setUrlTitleInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Live preview active item state
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [previewVideoPlaying, setPreviewVideoPlaying] = useState<boolean>(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Sync internal items back to parent handlers
  const updateItems = (newItems: ProductMediaItem[]) => {
    setItems(newItems);
    if (onChangeMediaList) {
      onChangeMediaList(newItems);
    }
    // Also sync to legacy fields for complete backwards compatibility
    const synced = syncMediaFields(newItems);
    onChangeImageUrl(synced.imageUrl || '');
    onChangeGalleryImages(synced.galleryImages || []);
    onChangeVideoUrl(synced.videoUrl || '');
    onChangeDimensionImageUrl(synced.dimensionImageUrl || '');

    if (previewIndex >= newItems.length) {
      setPreviewIndex(Math.max(0, newItems.length - 1));
    }
  };

  // Convert File to base64 Data URL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Process uploaded files (Supports MULTIPLE images and videos simultaneously!)
  const handleIncomingFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newMediaItems: ProductMediaItem[] = [];
    let imageCount = 0;
    let videoCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const itemType: MediaItemType = isVideo ? 'video' : 'image';
        if (isVideo) videoCount++;
        else imageCount++;

        newMediaItems.push({
          id: `media-upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: itemType,
          url: dataUrl,
          title: file.name,
        });
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }

    if (newMediaItems.length > 0) {
      const combined = [...items, ...newMediaItems];
      updateItems(combined);
      notify(`Berhasil menambahkan ${imageCount > 0 ? `${imageCount} foto` : ''} ${imageCount > 0 && videoCount > 0 ? 'dan ' : ''}${videoCount > 0 ? `${videoCount} video` : ''}!`);
    } else {
      notify('Format file tidak didukung. Mohon gunakan format gambar (JPG/PNG/WebP) atau video (MP4/WebM).');
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    await handleIncomingFiles(e.dataTransfer.files);
  };

  // Add media via URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const trimmed = urlInput.trim();
    const newItem: ProductMediaItem = {
      id: `media-url-${Date.now()}`,
      type: urlTypeInput,
      url: trimmed,
      title: urlTitleInput.trim() || (urlTypeInput === 'video' ? 'Video Demonstrasi' : urlTypeInput === 'dimension' ? 'Skema Dimensi' : 'Foto Produk'),
    };

    updateItems([...items, newItem]);
    setUrlInput('');
    setUrlTitleInput('');
    setShowUrlModal(false);
    notify(`Media ${urlTypeInput === 'video' ? 'video' : urlTypeInput === 'dimension' ? 'dimensi CAD' : 'foto'} berhasil ditambahkan!`);
  };

  // Load Higold Curated Samples
  const handleLoadSamples = () => {
    updateItems([...SAMPLE_PRESETS]);
    notify('5 media sampel arsitektural (3 Foto, 1 Video Soft-Close, 1 Skema Dimensi CAD) berhasil dimuat!');
  };

  // Reorder items: Move left
  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    updateItems(newItems);
  };

  // Reorder items: Move right
  const handleMoveRight = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    updateItems(newItems);
  };

  // Set as primary cover
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = items[index];
    const filtered = items.filter((_, idx) => idx !== index);
    updateItems([item, ...filtered]);
    setPreviewIndex(0);
    notify(`"${item.title || 'Media'}" dijadikan sampul utama produk.`);
  };

  // Delete item
  const handleDeleteItem = (index: number) => {
    const deleted = items[index];
    const newItems = items.filter((_, idx) => idx !== index);
    updateItems(newItems);
    notify(`Media telah dihapus.`);
  };

  // Change item type
  const handleChangeType = (index: number, newType: MediaItemType) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      type: newType,
      title: newType === 'video' 
        ? 'Video Demonstrasi' 
        : newType === 'dimension' 
        ? 'Skema Dimensi CAD' 
        : 'Foto Produk'
    };
    updateItems(newItems);
  };

  const activeItem = items[previewIndex] || items[0];

  return (
    <div className="space-y-5 bg-white border border-slate-200 p-5 rounded-none shadow-xs">
      {/* Header Bar - Modern Onyx Black & Blue styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-sky-600 rounded-none inline-block"></span>
            <h4 className="font-display font-bold text-slate-950 text-base tracking-tight">
              Koleksi Media Produk Terpadu
            </h4>
            <span className="px-2 py-0.5 bg-[#09090b] text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
              Foto · Video · Dimensi Berjajar
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Unggah beberapa foto dan video sekaligus. Seluruh media akan ditampilkan berdampingan di bawah tampilan utama produk.
          </p>
        </div>

        {/* Counter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200">
            Total: <strong className="text-slate-900">{items.length}</strong>
          </span>
          <span className="px-2 py-1 bg-sky-50 text-sky-800 text-[11px] font-mono border border-sky-200">
            {items.filter(i => i.type === 'image').length} Foto
          </span>
          <span className="px-2 py-1 bg-slate-900 text-sky-300 text-[11px] font-mono border border-slate-800">
            {items.filter(i => i.type === 'video').length} Video
          </span>
          <span className="px-2 py-1 bg-slate-100 text-purple-800 text-[11px] font-mono border border-purple-200">
            {items.filter(i => i.type === 'dimension').length} Dimensi CAD
          </span>
        </div>
      </div>

      {/* Upload Feedback Toast */}
      {feedback && (
        <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between animate-slide-up border-l-4 border-sky-500 shadow-md">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-medium">{feedback}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================= 1. UNIFIED DRAG & DROP MULTI-FILE UPLOAD ZONE ================= */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed p-6 sm:p-8 transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
          isDragOver
            ? 'border-neutral-900 bg-neutral-100 scale-[1.01]'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleIncomingFiles(e.target.files)}
        />

        <div className="w-14 h-14 bg-[#09090b] text-sky-400 flex items-center justify-center shadow-md">
          <Upload className="w-7 h-7" />
        </div>

        <div>
          <p className="font-display font-bold text-slate-900 text-sm sm:text-base">
            Tarik & Lepaskan File Media ke Sini, atau <span className="text-sky-600 underline underline-offset-4">Jelajahi File</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            Dapat memilih beberapa file sekaligus (Multi-select). Mendukung gambar JPG, PNG, WebP dan video demonstrasi MP4, WebM.
          </p>
        </div>

        {/* Action Buttons inside Dropzone */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#09090b] hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs btn-press"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Pilih File Komputer / HP</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUrlModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 shadow-xs btn-press"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Tambah via URL / Link</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSamples}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Muat Sampel Higold Lengkap</span>
          </button>
        </div>
      </div>

      {/* ================= 2. URL INPUT MODAL ================= */}
      {showUrlModal && (
        <div className="p-4 bg-slate-900 text-white border border-slate-800 animate-slide-up space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-sky-400">
              <ExternalLink className="w-4 h-4" />
              <span>Input Media Direct URL</span>
            </span>
            <button
              type="button"
              onClick={() => setShowUrlModal(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddUrl} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-300 mb-1">
                  URL Media (Gambar / Video MP4 / Blueprint CAD) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/media/file.jpg atau .mp4"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">
                  Kategori Media
                </label>
                <select
                  value={urlTypeInput}
                  onChange={(e) => setUrlTypeInput(e.target.value as MediaItemType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="image">🖼️ Foto Produk</option>
                  <option value="video">🎥 Video Demonstrasi Mekanik</option>
                  <option value="dimension">📐 Skema Dimensi CAD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Keterangan / Judul Singkat (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Sudut Buka 90 Derajat, Baki Logam Berlian"
                value={urlTitleInput}
                onChange={(e) => setUrlTitleInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan Media</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= 3. UNIFIED MEDIA ITEMS LIST (BERJAJAR & REORDERABLE) ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>Daftar Media Terunggah</span>
            <span className="text-[10px] font-mono text-slate-500 lowercase">
              (urutan tampilan produk dari kiri ke kanan)
            </span>
          </h5>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => updateItems([])}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
            Belum ada media yang diunggah. Silakan tarik file foto atau video ke area di atas, atau klik "Muat Sampel Higold Lengkap".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`relative bg-white border transition-all flex flex-col justify-between group ${
                  idx === 0
                    ? 'border-neutral-900 ring-2 ring-neutral-900/20 shadow-xs'
                    : 'border-slate-300'
                }`}
              >
                {/* Media Preview Thumbnail */}
                <div className="relative aspect-4/3 bg-slate-950 overflow-hidden flex items-center justify-center">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-[#09090b]">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-80"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#09090b] text-sky-400 text-[9px] font-mono uppercase font-bold border border-slate-700">
                        VIDEO
                      </div>
                    </div>
                  ) : item.type === 'dimension' ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-900 p-2">
                      <img
                        src={item.url}
                        alt={item.title || 'Dimensi'}
                        className="w-full h-full object-contain filter contrast-125"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#09090b] text-purple-400 text-[9px] font-mono uppercase font-bold border border-slate-700">
                        CAD DIMENSI
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={item.url}
                        alt={item.title || 'Foto'}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#09090b] text-sky-400 text-[9px] font-mono uppercase font-bold flex items-center gap-1 border border-slate-700 shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-sky-400" />
                          <span>SAMPUL UTAMA</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order index pill */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#09090b]/85 text-white font-mono text-[10px] border border-slate-700">
                    #{idx + 1}
                  </div>
                </div>

                {/* Control Panel for each item */}
                <div className="p-2.5 space-y-2 bg-slate-50/80 border-t border-slate-200">
                  {/* Type Selector Buttons */}
                  <div className="flex items-center gap-1 bg-slate-200 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleChangeType(idx, 'image')}
                      className={`flex-1 py-0.5 px-1 font-semibold uppercase text-center transition-colors cursor-pointer ${
                        item.type === 'image'
                          ? 'bg-[#09090b] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Ubah jadi Foto"
                    >
                      Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeType(idx, 'video')}
                      className={`flex-1 py-0.5 px-1 font-semibold uppercase text-center transition-colors cursor-pointer ${
                        item.type === 'video'
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Ubah jadi Video"
                    >
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeType(idx, 'dimension')}
                      className={`flex-1 py-0.5 px-1 font-semibold uppercase text-center transition-colors cursor-pointer ${
                        item.type === 'dimension'
                          ? 'bg-purple-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Ubah jadi Dimensi CAD"
                    >
                      CAD
                    </button>
                  </div>

                  {/* Title / file name */}
                  <p className="text-[11px] font-medium text-slate-800 truncate" title={item.title}>
                    {item.title || `Media #${idx + 1}`}
                  </p>

                  {/* Action Buttons: Left, Right, Make Cover, Delete */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveLeft(idx)}
                        className={`p-1 border border-slate-300 transition-colors ${
                          idx === 0
                            ? 'opacity-30 cursor-not-allowed bg-slate-100'
                            : 'hover:bg-white text-slate-700 cursor-pointer'
                        }`}
                        title="Geser ke kiri / urutan sebelumnya"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMoveRight(idx)}
                        className={`p-1 border border-slate-300 transition-colors ${
                          idx === items.length - 1
                            ? 'opacity-30 cursor-not-allowed bg-slate-100'
                            : 'hover:bg-white text-slate-700 cursor-pointer'
                        }`}
                        title="Geser ke kanan / urutan berikutnya"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="p-1 border border-slate-300 hover:bg-sky-50 hover:text-sky-700 text-slate-700 cursor-pointer"
                          title="Jadikan Sampul Utama"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 border border-transparent cursor-pointer"
                      title="Hapus media ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 4. LIVE INTERACTIVE DETAIL PREVIEW (BERJAJAR) ================= */}
      {items.length > 0 && (
        <div className="border border-slate-300 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Simulasi Pratinjau Tampilan Detail (Berjajar di Bawah)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Media Aktif: #{previewIndex + 1} dari {items.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Stage Viewport */}
            <div className="md:col-span-8 bg-[#09090b] aspect-16/9 relative overflow-hidden flex items-center justify-center border border-slate-800">
              {activeItem && activeItem.type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={previewVideoRef}
                    src={activeItem.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#09090b] text-sky-400 text-[10px] font-mono font-bold uppercase border border-slate-700">
                    PREVIEW VIDEO MEKANIK
                  </div>
                </div>
              ) : activeItem && activeItem.type === 'dimension' ? (
                <div className="relative w-full h-full flex items-center justify-center p-4 bg-slate-950">
                  <img
                    src={activeItem.url}
                    alt={activeItem.title}
                    className="w-full h-full object-contain filter contrast-125"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#09090b] text-purple-400 text-[10px] font-mono font-bold uppercase border border-slate-700">
                    PREVIEW SKEMA DIMENSI CAD
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={activeItem?.url}
                    alt={activeItem?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#09090b] text-white text-[10px] font-mono font-bold uppercase border border-slate-700">
                    PREVIEW FOTO PRODUK
                  </div>
                </div>
              )}
            </div>

            {/* Info on right */}
            <div className="md:col-span-4 flex flex-col justify-between text-xs space-y-2">
              <div className="p-3 bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-sky-700 uppercase font-bold">
                  {activeItem?.type.toUpperCase()}
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {activeItem?.title || 'Media Produk'}
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Ketika pengunjung mengklik salah satu thumbnail di baris berjajar di bawah, layar utama di atas langsung berganti menampilkan media tersebut secara instan dan mulus.
                </p>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 text-[11px] space-y-1">
                <span className="font-semibold text-white">Prinsip Desain Terpadu:</span>
                <p className="text-slate-400">
                  Foto, Video, dan Dimensi CAD bersatu dalam satu barisan rapi tanpa pemisahan tab yang kaku.
                </p>
              </div>
            </div>
          </div>

          {/* THE ROW UNDERNEATH (BERJAJAR DI BAWAH GAMBAR/VIDEO) */}
          <div className="pt-2">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              Baris Thumbnail Berjajar (Klik untuk berganti tampilan):
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
              {items.map((item, idx) => (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => setPreviewIndex(idx)}
                  className={`w-16 h-16 shrink-0 relative overflow-hidden transition-all cursor-pointer border-2 ${
                    previewIndex === idx
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 scale-105 shadow-md'
                      : 'border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-[#09090b] flex items-center justify-center relative">
                      <video src={item.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      <span className="absolute bottom-0 inset-x-0 bg-[#09090b]/90 text-[8px] font-mono text-sky-400 text-center py-0.5">
                        VIDEO
                      </span>
                    </div>
                  ) : item.type === 'dimension' ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                      <img src={item.url} alt="CAD" className="w-full h-full object-contain" />
                      <span className="absolute bottom-0 inset-x-0 bg-[#09090b]/90 text-[8px] font-mono text-purple-300 text-center py-0.5">
                        CAD
                      </span>
                    </div>
                  ) : (
                    <img src={item.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
