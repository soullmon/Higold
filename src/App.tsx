import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from './data/products';
import { Product, CartItem, Order, CategoryId, SubcategoryId, ProductSeries, CategoryInfo, CMSAccessRole, UserProfile, PdfCatalogItem, CompanyOfficialConfig } from './types';
import { INITIAL_PDF_CATALOGS, INITIAL_COMPANY_CONFIG } from './data/catalogsData';
import { Navbar, NavPage } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { SupportPage } from './components/pages/SupportPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { ProductModal } from './components/ProductModal';
import { CabinetCalculator } from './components/CabinetCalculator';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ShowroomModal } from './components/ShowroomModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { InvoiceViewerModal } from './components/InvoiceViewerModal';
import { ProfilePage } from './components/pages/ProfilePage';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { AdminPage } from './components/pages/AdminPage';
import { PolicyPage } from './components/pages/PolicyPage';
import { Footer } from './components/Footer';
import { PWAInstallModal, OfflineIndicator } from './components/PWAInstallModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PhoneCall, Layers } from 'lucide-react';

export default function App() {
  // Multi-Page Routing State
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Products State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('higold_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cached products', e);
    }
    return PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products to localStorage', e);
    }
  }, [products]);

  // Categories State with LocalStorage Persistence
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('higold_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cached categories', e);
    }
    return CATEGORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_custom_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to persist categories to localStorage', e);
    }
  }, [categories]);

  // Persistent PDF Catalogs managed via CMS
  const [pdfCatalogs, setPdfCatalogs] = useState<PdfCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('higold_cms_pdf_catalogs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PDF_CATALOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_pdf_catalogs', JSON.stringify(pdfCatalogs));
    } catch {}
  }, [pdfCatalogs]);

  // Persistent Company & Showroom Config managed via CMS
  const [companyConfig, setCompanyConfig] = useState<CompanyOfficialConfig>(() => {
    try {
      const saved = localStorage.getItem('higold_cms_company_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMPANY_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_company_config', JSON.stringify(companyConfig));
    } catch {}
  }, [companyConfig]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [whatsAppPrefilledProduct, setWhatsAppPrefilledProduct] = useState<string | undefined>(undefined);
  const [isShowroomOpen, setIsShowroomOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState<boolean>(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [policyModalConfig, setPolicyModalConfig] = useState<{ isOpen: boolean; tab: PolicyTab }>({
    isOpen: false,
    tab: 'terms',
  });
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState<boolean>(false);

  // Customer Profile State with LocalStorage Persistence
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('higold_user_profile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const handleUpdateUserProfile = (newProfile: UserProfile | null) => {
    setUserProfile(newProfile);
    try {
      if (newProfile) {
        localStorage.setItem('higold_user_profile', JSON.stringify(newProfile));
        // Sync to CMS users if not already present
        const cmsUsersRaw = localStorage.getItem('higold_cms_users');
        let cmsUsers = cmsUsersRaw ? JSON.parse(cmsUsersRaw) : [];
        const existingIdx = cmsUsers.findIndex((u: any) => u.id === newProfile.id || u.email === newProfile.email || u.phone === newProfile.phone);
        if (existingIdx >= 0) {
          cmsUsers[existingIdx] = {
            ...cmsUsers[existingIdx],
            name: newProfile.name,
            email: newProfile.email,
            phone: newProfile.phone,
            role: newProfile.accountType === 'b2b' ? 'customer_pro' : cmsUsers[existingIdx].role || 'customer_regular',
          };
        } else {
          cmsUsers.unshift({
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            phone: newProfile.phone,
            role: newProfile.accountType === 'b2b' ? 'customer_pro' : 'customer_regular',
            status: 'active',
            companyOrProject: newProfile.accountType === 'b2b' ? 'Mitra B2B / Proyek' : 'Residensial Pribadi',
            joinedDate: newProfile.joinedDate || new Date().toISOString().split('T')[0],
            totalOrders: 0,
            totalSpent: 0,
            lastLogin: 'Baru saja',
            notes: 'Mendaftar via Website Higold',
          });
        }
        localStorage.setItem('higold_cms_users', JSON.stringify(cmsUsers));
      } else {
        localStorage.removeItem('higold_user_profile');
      }
    } catch {}
  };

  // Dedicated Admin Account & Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('higold_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [adminPortalTarget, setAdminPortalTarget] = useState<CMSAccessRole>('admin');
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('higold_admin_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) return parsed.email;
      }
    } catch {}
    return 'admin@higold.co.id';
  });

  // Active Role in CMS: 'admin' (Master Admin) or 'cs_support' (CS Desk)
  const [cmsRole, setCmsRole] = useState<CMSAccessRole>(() => {
    try {
      const savedRole = localStorage.getItem('higold_cms_active_role');
      if (savedRole === 'cs_support' || savedRole === 'admin') return savedRole;
    } catch {}
    return 'admin';
  });

  const handleOpenSpecificPortal = (portal: CMSAccessRole) => {
    setAdminPortalTarget(portal);
    if (isAdminAuthenticated && cmsRole === portal) {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Handler for Secret Admin Triggers (Gatekeeper)
  const handleTriggerAdminAccess = () => {
    if (isAdminAuthenticated) {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (role: CMSAccessRole, email: string) => {
    setIsAdminAuthenticated(true);
    setCmsRole(role);
    setAdminEmail(email);
    setIsAdminLoginOpen(false);
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('higold_admin_session');
    } catch {}
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Secret Admin Access via Shortcut (Ctrl+Shift+A / Cmd+Shift+A) or URL hash (#admin / ?admin=true)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleTriggerAdminAccess();
      }
    };

    const checkSecretUrl = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        handleTriggerAdminAccess();
      }
    };

    checkSecretUrl();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkSecretUrl);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkSecretUrl);
    };
  }, [isAdminAuthenticated]);

  // Order state
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('higold_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('higold_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently quick-added ID for visual feedback
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('higold_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('higold_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Navigation Handler
  const handleNavigate = (page: NavPage, catId?: CategoryId | 'all', subcatId?: string) => {
    const targetPage = page === 'about' ? 'home' : page;
    setCurrentPage(targetPage);
    if (catId !== undefined) {
      setActiveCategory(catId);
    }
    if (subcatId !== undefined) {
      setActiveSubcategoryId(subcatId);
    } else {
      setActiveSubcategoryId(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product CMS Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleResetToDefault = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem('higold_products');
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedWidth: number,
    selectedOpening: string | undefined,
    selectedFinish: string,
    quantity: number,
    selectedSku?: string
  ) => {
    const variant = product.variants?.find((v) => v.sizeWidth === selectedWidth);
    const finalSku = selectedSku || variant?.sku || product.sku;
    const finalPrice = variant?.price || product.price;
    const compositeKey = `${product.id}_${finalSku}_${selectedOpening || 'uni'}_${selectedFinish}`;
    
    // Create a product copy with selected variant price and specific SKU
    const itemProduct: Product = {
      ...product,
      sku: finalSku,
      price: finalPrice,
      originalPrice: variant?.originalPrice || product.originalPrice,
    };

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === compositeKey);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: compositeKey,
          productId: product.id,
          product: itemProduct,
          selectedWidth,
          selectedSku: finalSku,
          selectedOpening,
          selectedFinish,
          quantity,
        },
      ];
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 1800);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(
      product,
      product.cabinetWidths[0],
      product.openingDirections ? product.openingDirections[0] : undefined,
      product.finishOptions[0],
      1
    );
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrderHistory((prev) => [newOrder, ...prev]);
    setRecentOrder(newOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);

    // Award Point Rewards for product purchase: 1 point per Rp 10.000 (min 100 points)
    const earnedPoints = Math.max(100, Math.floor(newOrder.totalAmount / 10000));
    try {
      const currentPts = Number(localStorage.getItem('higold_user_points') || '2500');
      const newPts = currentPts + earnedPoints;
      localStorage.setItem('higold_user_points', newPts.toString());
      
      const historyRaw = localStorage.getItem('higold_points_history');
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift({
        id: `pts-${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        description: `Pembelian Produk Higold (Order #${newOrder.orderNumber})`,
        points: `+${earnedPoints.toLocaleString('id-ID')}`,
        type: 'earn',
      });
      localStorage.setItem('higold_points_history', JSON.stringify(history));
    } catch {}

    // Sync user stats in CMS users
    try {
      const cmsUsersRaw = localStorage.getItem('higold_cms_users');
      if (cmsUsersRaw) {
        let cmsUsers = JSON.parse(cmsUsersRaw);
        const idx = cmsUsers.findIndex((u: any) => 
          (userProfile && u.id === userProfile.id) || 
          (newOrder.customer && (u.email === newOrder.customer.email || u.phone === newOrder.customer.phone))
        );
        if (idx >= 0) {
          cmsUsers[idx].totalOrders = (cmsUsers[idx].totalOrders || 0) + 1;
          cmsUsers[idx].totalSpent = (cmsUsers[idx].totalSpent || 0) + newOrder.totalAmount;
          localStorage.setItem('higold_cms_users', JSON.stringify(cmsUsers));
        }
      }
    } catch {}
  };

  const handleOpenWhatsAppConsult = (productName?: string) => {
    setWhatsAppPrefilledProduct(productName);
    setIsWhatsAppOpen(true);
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleBatchImportProducts = (newProducts: Product[]) => {
    setProducts((prev) => [...newProducts, ...prev]);
  };

  const handleAddCategory = (newCat: CategoryInfo) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: CategoryInfo) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleAddSubcategory = (categoryId: string, subcat: { id: SubcategoryId; name: string }) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, subcategories: [...c.subcategories, subcat] } : c
      )
    );
  };

  // Direct scroll to Calculator section on the page (no popup modal!)
  const handleScrollToCalculator = () => {
    setIsCalculatorOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
    setTimeout(() => {
      const el = document.getElementById('cabinet-calculator-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Dedicated Full Configuration Page for Admin (Not a popup!)
  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 selection:bg-[#FAF6ED] selection:text-[#8A6B29]">
          <AuthModal
            isOpen={true}
            onClose={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialMode="login"
            onAdminLoginSuccess={handleAdminLoginSuccess}
            userProfile={userProfile}
            onUpdateUserProfile={handleUpdateUserProfile}
          />
        </div>
      );
    }

    return (
      <AdminPage
        products={products}
        categories={categories}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onBatchImportProducts={handleBatchImportProducts}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddSubcategory={handleAddSubcategory}
        onResetToDefault={handleResetToDefault}
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleAdminLogout}
        adminEmail={adminEmail}
        onUpdateAdminEmail={(email) => setAdminEmail(email)}
        currentRole={cmsRole}
        pdfCatalogs={pdfCatalogs}
        onAddPdfCatalog={(newPdf) => {
          setPdfCatalogs(prev => [newPdf, ...prev]);
        }}
        onUpdatePdfCatalog={(updatedPdf) => {
          setPdfCatalogs(prev => prev.map(p => p.id === updatedPdf.id ? updatedPdf : p));
        }}
        onDeletePdfCatalog={(id) => {
          setPdfCatalogs(prev => prev.filter(p => p.id !== id));
        }}
        companyConfig={companyConfig}
        onUpdateCompanyConfig={(cfg) => {
          setCompanyConfig(cfg);
        }}
        orders={orderHistory}
        onUpdateOrderStatus={(orderId, newStatus) => {
          setOrderHistory(prev => prev.map(o => o.id === orderId ? { ...o, trackingStatus: newStatus } : o));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans">
      {/* 1. Header & Navigation (Matching Higold Layout) */}
      <Navbar
        currentPage={currentPage}
        activeCategory={activeCategory}
        cartCount={cartTotalCount}
        cartTotalAmount={cartTotalAmount}
        searchQuery={searchQuery}
        categories={categories}
        userProfile={userProfile}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentPage !== 'category') {
            setCurrentPage('category');
          }
        }}
        onSearchSubmit={() => {
          setCurrentPage('category');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsAppConsult()}
        onOpenCalculator={handleScrollToCalculator}
        onOpenAdminLogin={() => handleTriggerAdminAccess()}
        onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
        onOpenAuth={(mode) => {
          if (mode === 'profile') {
            handleNavigate('profile');
          } else {
            setAuthInitialMode(mode || 'login');
            setIsAuthOpen(true);
          }
        }}
      />

      {/* 2. Main Page Render */}
      <main className="flex-1 w-full pb-20 md:pb-16">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            onNavigateCategory={(catId: CategoryId, subcatId?: string) => handleNavigate('category', catId, subcatId)}
            onNavigateAllCatalog={() => handleNavigate('category', 'all')}
            onNavigateAbout={() => handleNavigate('about')}
            onNavigateContact={() => handleNavigate('contact')}
            onNavigateSupport={() => handleNavigate('support')}
            onOpenCalculator={handleScrollToCalculator}
            onOpenShowroom={() => handleNavigate('showroom')}
            onOpenWhatsApp={() => handleOpenWhatsAppConsult()}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAdd={(p) => handleQuickAdd(p)}
            quickAddedId={quickAddedId}
            userProfile={userProfile}
            onOpenAuth={(mode) => {
              if (mode === 'profile') {
                handleNavigate('profile');
              } else {
                setAuthInitialMode(mode || 'login');
                setIsAuthOpen(true);
              }
            }}
            onCustomerRegistered={(newProfile: UserProfile) => handleUpdateUserProfile(newProfile)}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            userProfile={userProfile}
            onUpdateUserProfile={handleUpdateUserProfile}
            orders={orderHistory}
            onSelectOrderReceipt={(ord) => {
              setInvoiceOrder(ord);
              setIsInvoiceViewerOpen(true);
            }}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCatalog={() => handleNavigate('category', 'all')}
            onOpenWhatsApp={(orderNum) => handleOpenWhatsAppConsult(orderNum ? `Pesanan #${orderNum}` : undefined)}
          />
        )}

        {currentPage === 'category' && (
          <CategoryPage
            categoryId={activeCategory}
            categories={categories}
            initialSubcategoryId={activeSubcategoryId as any || 'all'}
            products={products}
            searchQuery={searchQuery}
            onSelectCategory={(catId: CategoryId | 'all', subcatId?: string) => {
              setActiveCategory(catId);
              if (subcatId) setActiveSubcategoryId(subcatId);
            }}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAdd={(p) => handleQuickAdd(p)}
            onOpenWhatsAppConsult={(name) => handleOpenWhatsAppConsult(name)}
            quickAddedId={quickAddedId}
            onOpenCalculator={handleScrollToCalculator}
          />
        )}

        {currentPage === 'portfolio' && (
          <PortfolioPage
            userProfile={userProfile}
            onRequireAuth={(mode, msg) => {
              setAuthMessage(msg || 'Silakan Masuk atau Buat Akun terlebih dahulu untuk mengunduh e-Katalog PDF resmi HIGOLD.');
              setAuthInitialMode(mode || 'login');
              setIsAuthOpen(true);
            }}
            onExploreProduct={() => handleNavigate('category', 'all')}
            onOpenWhatsApp={(name) => handleOpenWhatsAppConsult(name)}
            pdfCatalogs={pdfCatalogs}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateCatalog={() => handleNavigate('category', 'all')}
            onOpenShowroom={() => handleNavigate('showroom')}
            onOpenWhatsApp={() => handleOpenWhatsAppConsult()}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onOpenShowroom={() => handleNavigate('showroom')}
          />
        )}

        {currentPage === 'support' && (
          <SupportPage
            onOpenCalculator={handleScrollToCalculator}
            onOpenWhatsApp={() => handleOpenWhatsAppConsult()}
          />
        )}

        {/* Dedicated Policy & Guide Pages (Not popups!) */}
        {['terms', 'privacy', 'howToOrder', 'shipping', 'returns', 'payment', 'showroom'].includes(currentPage) && (
          <PolicyPage
            initialTab={currentPage as any}
            onNavigateHome={() => handleNavigate('home')}
            onOpenWhatsApp={() => handleOpenWhatsAppConsult()}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}
      </main>

      {/* 3. Corporate Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWhatsApp={() => handleOpenWhatsAppConsult()}
        onOpenShowroom={() => handleNavigate('showroom')}
        onOpenCalculator={handleScrollToCalculator}
        onSecretAdminAccess={handleTriggerAdminAccess}
      />

      {/* 5. Modals Across All Pages */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenWhatsAppConsult={(name) => handleOpenWhatsAppConsult(name)}
      />

      <CabinetCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        products={products}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          if (!userProfile) {
            setIsCartOpen(false);
            setAuthMessage('Silakan Masuk atau Buat Akun terlebih dahulu untuk melanjutkan checkout dan melakukan pemesanan resmi HIGOLD.');
            setAuthInitialMode('login');
            setIsAuthOpen(true);
            return;
          }
          setIsCheckoutOpen(true);
        }}
        onExploreProducts={() => {
          setIsCartOpen(false);
          handleNavigate('category', 'all');
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        userProfile={userProfile}
        onOrderCreated={handleOrderCreated}
        onRequireAuth={(mode, msg) => {
          setIsCheckoutOpen(false);
          setAuthMessage(msg || 'Silakan Masuk atau Buat Akun terlebih dahulu untuk melanjutkan checkout pemesanan.');
          setAuthInitialMode(mode || 'login');
          setIsAuthOpen(true);
        }}
      />

      <OrderSuccessModal
        order={recentOrder}
        onClose={() => setRecentOrder(null)}
        onViewOrders={() => {
          handleNavigate('profile');
        }}
        userProfile={userProfile}
        onRequireAuth={(mode, msg) => {
          setAuthMessage(msg || 'Silakan Masuk atau Buat Akun terlebih dahulu untuk mengunduh nota PDF resmi.');
          setAuthInitialMode(mode || 'login');
          setIsAuthOpen(true);
        }}
        onOpenInvoiceViewer={(ord) => {
          setInvoiceOrder(ord);
          setIsInvoiceViewerOpen(true);
        }}
      />

      <InvoiceViewerModal
        isOpen={isInvoiceViewerOpen}
        order={invoiceOrder}
        userProfile={userProfile}
        onClose={() => setIsInvoiceViewerOpen(false)}
        onRequireAuth={() => {
          setIsInvoiceViewerOpen(false);
          setAuthMessage('Silakan Masuk atau Buat Akun terlebih dahulu untuk mengunduh atau mencetak nota invoice resmi HIGOLD.');
          setAuthInitialMode('login');
          setIsAuthOpen(true);
        }}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => {
          setIsWhatsAppOpen(false);
          setWhatsAppPrefilledProduct(undefined);
        }}
        prefilledProduct={whatsAppPrefilledProduct}
      />

      <ShowroomModal
        isOpen={isShowroomOpen}
        onClose={() => setIsShowroomOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        products={products}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthMessage(null);
        }}
        initialMode={authInitialMode}
        authMessage={authMessage}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        userProfile={userProfile}
        onUpdateUserProfile={handleUpdateUserProfile}
      />

      <PolicyModal
        isOpen={policyModalConfig.isOpen}
        onClose={() => setPolicyModalConfig(prev => ({ ...prev, isOpen: false }))}
        initialTab={policyModalConfig.tab}
      />

      {/* 6. Responsive Mobile Bottom Navigation Bar (Screens < md) */}
      <MobileBottomNav
        currentPage={currentPage}
        cartCount={cartTotalCount}
        userProfile={userProfile}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCalculator={handleScrollToCalculator}
        onOpenAuth={(mode) => {
          if (mode === 'profile') {
            handleNavigate('profile');
          } else {
            setAuthInitialMode(mode || 'login');
            setIsAuthOpen(true);
          }
        }}
      />

      {/* 7. Progressive Web App (PWA) Install Modal & Offline Indicator */}
      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />

      <OfflineIndicator />
    </div>
  );
}
