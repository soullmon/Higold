import React, { useState, useEffect } from 'react';
import { 
  Product, CategoryInfo, SubcategoryId, CMSAccessRole, 
  CMSUser, UserRole, AccountStatus, ProductReview, 
  CustomerReportTicket, PdfCatalogItem, CompanyOfficialConfig,
  Order, OrderTrackingStatus, OfficialAccountType, OrderWorkflowStatus 
} from '../../types';
import { 
  INITIAL_CMS_USERS, INITIAL_PRODUCT_REVIEWS, 
  INITIAL_REPORT_TICKETS, INITIAL_CUSTOMER_ORDERS 
} from '../../data/cmsData';
import { INITIAL_PDF_CATALOGS, INITIAL_COMPANY_CONFIG } from '../../data/catalogsData';
import { AdminSidebar, AdminTab } from '../admin/AdminSidebar';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminDashboardTab } from '../admin/AdminDashboardTab';
import { AdminCatalogTab } from '../admin/AdminCatalogTab';
import { AdminOrdersTab } from '../admin/AdminOrdersTab';
import { AdminShippingTab } from '../admin/AdminShippingTab';
import { AdminReportsTab } from '../admin/AdminReportsTab';
import { AdminReviewsTab } from '../admin/AdminReviewsTab';
import { AdminDesignTab } from '../admin/AdminDesignTab';
import { AdminBroadcastTab } from '../admin/AdminBroadcastTab';
import { AdminCustomersTab } from '../admin/AdminCustomersTab';
import { AdminFinancialTab } from '../admin/AdminFinancialTab';
import { AdminManageTab } from '../admin/AdminManageTab';
import { AdminPromotionTab } from '../admin/AdminPromotionTab';
import { AdminCategoriesTab } from '../admin/AdminCategoriesTab';

interface AdminPageProps {
  products: Product[];
  categories: CategoryInfo[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBatchImportProducts: (newProducts: Product[]) => void;
  onAddCategory: (category: CategoryInfo) => void;
  onUpdateCategory?: (category: CategoryInfo) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onAddSubcategory: (categoryId: string, subcategory: { id: SubcategoryId; name: string }) => void;
  onResetToDefault: () => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  adminEmail: string;
  onUpdateAdminEmail?: (newEmail: string) => void;
  currentRole: CMSAccessRole;
  onChangeRole?: (role: CMSAccessRole) => void;
  pdfCatalogs?: PdfCatalogItem[];
  onAddPdfCatalog?: (item: PdfCatalogItem) => void;
  onUpdatePdfCatalog?: (item: PdfCatalogItem) => void;
  onDeletePdfCatalog?: (id: string) => void;
  companyConfig?: CompanyOfficialConfig;
  onUpdateCompanyConfig?: (config: CompanyOfficialConfig) => void;
  orders?: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderTrackingStatus) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBatchImportProducts,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubcategory,
  onResetToDefault,
  onNavigateHome,
  onLogout,
  adminEmail,
  onUpdateAdminEmail,
  currentRole,
  pdfCatalogs: propPdfCatalogs,
  onAddPdfCatalog: propOnAddPdfCatalog,
  onUpdatePdfCatalog: propOnUpdatePdfCatalog,
  onDeletePdfCatalog: propOnDeletePdfCatalog,
  companyConfig: propCompanyConfig,
  onUpdateCompanyConfig: propOnUpdateCompanyConfig,
  orders: propOrders,
  onUpdateOrderStatus: propOnUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Automatically enforce view restrictions when switching to CS role
  useEffect(() => {
    if (currentRole === 'cs_support') {
      if (activeTab === 'financial' || activeTab === 'manage') {
        setActiveTab('dashboard');
      }
    }
  }, [currentRole, activeTab]);

  // Persistent Orders (Pelanggan yang sudah membeli)
  const [orders, setOrders] = useState<Order[]>(() => {
    if (propOrders && propOrders.length > 0) return propOrders;
    try {
      const saved = localStorage.getItem('higold_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CUSTOMER_ORDERS;
  });

  useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setOrders(propOrders);
    }
  }, [propOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('higold_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderTrackingStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, trackingStatus: newStatus } : o);
      try {
        localStorage.setItem('higold_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (propOnUpdateOrderStatus) {
      propOnUpdateOrderStatus(orderId, newStatus);
    }
  };

  const handleUpdateOrderWorkflowStatus = (orderId: string, newWorkflowStatus: OrderWorkflowStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          const isDiproses = newWorkflowStatus === 'diproses';
          const isSelesai = newWorkflowStatus === 'selesai';
          const newTrackingStatus: OrderTrackingStatus = isSelesai ? 'sampai_tujuan' : isDiproses ? 'diproses' : o.trackingStatus;
          return {
            ...o,
            orderStatus: newWorkflowStatus,
            paymentStatus: (isDiproses || isSelesai) ? 'confirmed' : o.paymentStatus,
            trackingStatus: newTrackingStatus,
          };
        }
        return o;
      });
      try {
        localStorage.setItem('higold_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Persistent PDF Catalogs
  const [pdfCatalogs, setPdfCatalogs] = useState<PdfCatalogItem[]>(() => {
    if (propPdfCatalogs && propPdfCatalogs.length > 0) return propPdfCatalogs;
    try {
      const saved = localStorage.getItem('higold_cms_pdf_catalogs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PDF_CATALOGS;
  });

  useEffect(() => {
    if (propPdfCatalogs) {
      setPdfCatalogs(propPdfCatalogs);
    }
  }, [propPdfCatalogs]);

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_pdf_catalogs', JSON.stringify(pdfCatalogs));
    } catch {}
  }, [pdfCatalogs]);

  // Persistent Company Official Config
  const [companyConfig, setCompanyConfig] = useState<CompanyOfficialConfig>(() => {
    if (propCompanyConfig) return propCompanyConfig;
    try {
      const saved = localStorage.getItem('higold_cms_company_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMPANY_CONFIG;
  });

  useEffect(() => {
    if (propCompanyConfig) {
      setCompanyConfig(propCompanyConfig);
    }
  }, [propCompanyConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_company_config', JSON.stringify(companyConfig));
    } catch {}
  }, [companyConfig]);

  const handleAddPdf = (item: PdfCatalogItem) => {
    setPdfCatalogs(prev => [item, ...prev]);
    if (propOnAddPdfCatalog) propOnAddPdfCatalog(item);
  };

  const handleUpdatePdf = (item: PdfCatalogItem) => {
    setPdfCatalogs(prev => prev.map(p => p.id === item.id ? item : p));
    if (propOnUpdatePdfCatalog) propOnUpdatePdfCatalog(item);
  };

  const handleDeletePdf = (id: string) => {
    setPdfCatalogs(prev => prev.filter(p => p.id !== id));
    if (propOnDeletePdfCatalog) propOnDeletePdfCatalog(id);
  };

  const handleUpdateConfig = (cfg: CompanyOfficialConfig) => {
    setCompanyConfig(cfg);
    if (propOnUpdateCompanyConfig) propOnUpdateCompanyConfig(cfg);
  };

  // Persistent CMS Users
  const [users, setUsers] = useState<CMSUser[]>(() => {
    try {
      const saved = localStorage.getItem('higold_cms_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CMS_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  // Persistent Product Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('higold_cms_reviews');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCT_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_reviews', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  // Persistent Reports / Tickets
  const [reports, setReports] = useState<CustomerReportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('higold_cms_reports');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REPORT_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higold_cms_reports', JSON.stringify(reports));
    } catch {}
  }, [reports]);

  // User Actions (Admin Only)
  const handleUpdateUserRole = (userId: string, roleData: any) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        if (typeof roleData === 'object' && roleData !== null) {
          return { 
            ...u, 
            role: roleData.role || u.role, 
            officialAccountType: roleData.officialAccountType || u.officialAccountType 
          };
        }
        return { ...u, role: roleData };
      }
      return u;
    }));
  };

  const handleUpdateUserStatus = (userId: string, newStatus: AccountStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleAddUser = (newUser: CMSUser) => {
    setUsers(prev => [newUser, ...prev]);
  };

  // Review Actions
  const handleReplyReview = (reviewId: string, replyText: string, authorName: string, role: CMSAccessRole) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          reply: {
            author: authorName,
            role,
            text: replyText,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          },
        };
      }
      return r;
    }));
  };

  const handleToggleReviewStatus = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          status: r.status === 'published' ? 'rejected' : 'published',
        };
      }
      return r;
    }));
  };

  // Ticket Actions
  const handleUpdateTicketStatus = (ticketId: string, status: CustomerReportTicket['status']) => {
    setReports(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
      }
      return t;
    }));
  };

  const handleAddTicketResponse = (ticketId: string, message: string, sender: string, senderRole: CMSAccessRole) => {
    const newResp = {
      id: `resp-${Date.now().toString(36)}`,
      sender,
      senderRole,
      message,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setReports(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: newResp.timestamp,
          responses: [...(t.responses || []), newResp],
        };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-row overflow-hidden font-sans text-neutral-800">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          currentRole={currentRole}
          onNavigateHome={onNavigateHome}
          onLogout={onLogout}
          adminEmail={adminEmail}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          counts={{
            products: products.length,
            categories: categories.length,
            users: users.length,
            reviews: reviews.length,
            reports: reports.length,
            orders: orders.length,
          }}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-72 bg-neutral-950 h-full">
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              currentRole={currentRole}
              onNavigateHome={onNavigateHome}
              onLogout={onLogout}
              adminEmail={adminEmail}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              counts={{
                products: products.length,
                categories: categories.length,
                users: users.length,
                reviews: reviews.length,
                reports: reports.length,
                orders: orders.length,
              }}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          currentRole={currentRole}
          adminEmail={adminEmail}
          onNavigateHome={onNavigateHome}
          onLogout={onLogout}
          onRefresh={() => {}}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* 1. Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                products={products}
                users={users}
                reviews={reviews}
                reports={reports}
                orders={orders}
                currentRole={currentRole}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAddProduct={() => setActiveTab('catalog')}
              />
            )}

            {/* 2. Katalog Input (termasuk Kategori) */}
            {activeTab === 'catalog' && (
              <AdminCatalogTab
                products={products}
                categories={categories}
                onAddProduct={onAddProduct}
                onUpdateProduct={onUpdateProduct}
                onDeleteProduct={onDeleteProduct}
                onAddCategory={onAddCategory}
                onAddSubcategory={onAddSubcategory}
                currentRole={currentRole}
              />
            )}

            {/* 3. Kategori & Icon Hardware */}
            {activeTab === 'categories' && (
              <AdminCategoriesTab
                categories={categories}
                products={products}
                onAddCategory={onAddCategory}
                onUpdateCategory={onUpdateCategory}
                onDeleteCategory={onDeleteCategory}
                onAddSubcategory={onAddSubcategory}
                currentRole={currentRole}
              />
            )}

            {/* 3. Pesanan */}
            {activeTab === 'orders' && (
              <AdminOrdersTab
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateOrderWorkflowStatus={handleUpdateOrderWorkflowStatus}
                currentRole={currentRole}
              />
            )}

            {/* 4. Pengiriman */}
            {activeTab === 'shipping' && (
              <AdminShippingTab
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                currentRole={currentRole}
              />
            )}

            {/* 5. Promosi & Reward Poin */}
            {activeTab === 'promotion' && (
              <AdminPromotionTab
                currentRole={currentRole}
              />
            )}

            {/* 5. Laporan */}
            {activeTab === 'reports' && (
              <AdminReportsTab
                reports={reports}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onAddTicketResponse={handleAddTicketResponse}
                currentRole={currentRole}
              />
            )}

            {/* 6. Ulasan */}
            {activeTab === 'reviews' && (
              <AdminReviewsTab
                reviews={reviews}
                onReplyReview={handleReplyReview}
                onToggleStatus={handleToggleReviewStatus}
                currentRole={currentRole}
                currentEmail={adminEmail}
              />
            )}

            {/* 7. Desain Website */}
            {activeTab === 'design' && (
              <AdminDesignTab
                pdfCatalogs={pdfCatalogs}
                onAddPdfCatalog={handleAddPdf}
                onUpdatePdfCatalog={handleUpdatePdf}
                onDeletePdfCatalog={handleDeletePdf}
                companyConfig={companyConfig}
                onUpdateCompanyConfig={handleUpdateConfig}
                currentRole={currentRole}
              />
            )}

            {/* 8. Broadcast */}
            {activeTab === 'broadcast' && (
              <AdminBroadcastTab
                users={users}
                currentRole={currentRole}
              />
            )}

            {/* 9. Pelanggan */}
            {activeTab === 'customers' && (
              <AdminCustomersTab
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                currentRole={currentRole}
              />
            )}

            {/* 10. Keuangan (Admin Only) */}
            {activeTab === 'financial' && (
              <AdminFinancialTab
                currentRole={currentRole}
                orders={orders}
              />
            )}

            {/* 11. Kelola (Admin Only) */}
            {activeTab === 'manage' && (
              <AdminManageTab
                users={users}
                onUpdateUserRole={handleUpdateUserRole}
                onUpdateUserStatus={handleUpdateUserStatus}
                onAddUser={handleAddUser}
                adminEmail={adminEmail}
                onUpdateAdminEmail={onUpdateAdminEmail}
                currentRole={currentRole}
                onResetToDefault={onResetToDefault}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
