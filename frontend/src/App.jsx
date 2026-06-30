import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './styles/design-tokens.css';

// ================= LAZY LOADED PAGES =================
// Páginas públicas
const LandingPage1 = lazy(() => import('./stitch/landing_page_1/LandingPage1'));
const ServicesPageVariant1 = lazy(() => import('./stitch/services_page_variant_1/ServicesPageVariant1'));
const AboutPage = lazy(() => import('./stitch/about_page/AboutPage'));
const ContactPageVariant1 = lazy(() => import('./stitch/contact_page_variant_1/ContactPageVariant1'));
const PricingPage = lazy(() => import('./stitch/pricing_page/PricingPage'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const PortalLogin = lazy(() => import('./stitch/portal_login/PortalLogin'));
const GoogleCallback = lazy(() => import('./pages/GoogleCallback'));

// Layouts
const PublicLayout = lazy(() => import('./components/PublicLayout'));

// Páginas privadas
const AdminUsuarios = lazy(() => import('./stitch/admin_usuarios/AdminUsuarios'));
const AdminDashboard = lazy(() => import('./stitch/admin_dashboard/AdminDashboard'));
const AdminContactos = lazy(() => import('./stitch/admin_contactos/AdminContactos'));
const ClientDashboard = lazy(() => import('./stitch/client_dashboard/ClientDashboard'));
const ClientDashboardOverview = lazy(() => import('./stitch/client_dashboard_overview/ClientDashboardOverview'));
const ClientProjectDashboard = lazy(() => import('./stitch/client_project_dashboard/ClientProjectDashboard'));
const AutomationPerformanceDashboard = lazy(() => import('./stitch/automation_performance_dashboard/AutomationPerformanceDashboard'));
const ActiveAutomationsListView = lazy(() => import('./stitch/active_automations_list_view/ActiveAutomationsListView'));
const AutomationManagementTable = lazy(() => import('./stitch/automation_management_table/AutomationManagementTable'));
const AutomationLogicTestView = lazy(() => import('./stitch/automation_logic_test_view/AutomationLogicTestView'));
const AutomationLogsErrorTracking = lazy(() => import('./stitch/automation_logs_error_tracking/AutomationLogsErrorTracking'));
const NewAutomationWizardStep1 = lazy(() => import('./stitch/new_automation_wizard_step_1/NewAutomationWizardStep1'));
const ErrorAnalysisView = lazy(() => import('./stitch/error_analysis_view/ErrorAnalysisView'));
const WorkflowDetailsVariant1 = lazy(() => import('./stitch/workflow_details_variant_1/WorkflowDetailsVariant1'));
const TechnicalSupportChat = lazy(() => import('./stitch/technical_support_chat/TechnicalSupportChat'));
const TicketConversationView = lazy(() => import('./stitch/ticket_conversation_view/TicketConversationView'));
const SupportTicketList = lazy(() => import('./stitch/support_ticket_list/SupportTicketList'));
const ProjectDetailView = lazy(() => import('./pages/ProjectDetailView'));
const MarketingDashboard = lazy(() => import('./stitch/marketing_dashboard/MarketingDashboard'));
const WebProjectsDashboard = lazy(() => import('./stitch/web_projects_dashboard/WebProjectsDashboard'));

// ================= SCROLL =================
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ================= LOADING COMPONENT =================
function PageLoader() {
  return (
    <div style={{
      background: '#0D1B2A',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="font-montserrat text-text-secondary">Cargando...</p>
    </div>
  );
}

// ================= WRAPPER PRIVADO =================
const P = ({ children }) => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        background: '#0D1B2A', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        Cargando sesión...
      </div>
    );
  }
  return <PrivateRoute>{children}</PrivateRoute>;
};

// ================= APP =================
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Routes>
        {/* PÚBLICO - Con layout unificado */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage1 />} />
          <Route path="/servicios" element={<ServicesPageVariant1 />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPageVariant1 />} />
          <Route path="/precios" element={<PricingPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="auth/google/callback" element={<GoogleCallback />} />
          <Route path="login" element={<PortalLogin />} />
        </Route>

        {/* PRIVADO — Portal (sin footer unificado en dashboard) */}
        <Route path="/admin" element={<P><AdminDashboard /></P>} />
        <Route path="/admin/usuarios" element={<P><AdminUsuarios /></P>} />
        <Route path="/admin/contactos" element={<P><AdminContactos /></P>} />
        <Route path="/dashboard"             element={<P><ClientDashboard /></P>} />
        <Route path="/dashboard/overview"    element={<P><ClientDashboardOverview /></P>} />
        <Route path="/dashboard/performance" element={<P><AutomationPerformanceDashboard /></P>} />
        <Route path="/cliente/proyecto" element={<P><ClientProjectDashboard /></P>} />

        {/* PRIVADO — Automatizaciones */}
        <Route path="/automatizaciones"              element={<P><ActiveAutomationsListView /></P>} />
        <Route path="/automatizaciones/tabla"        element={<P><AutomationManagementTable /></P>} />
        <Route path="/automatizaciones/nueva"        element={<P><NewAutomationWizardStep1 /></P>} />
        <Route path="/automatizaciones/logica"       element={<P><AutomationLogicTestView /></P>} />
        <Route path="/automatizaciones/logica/:key"  element={<P><AutomationLogicTestView /></P>} />
        <Route path="/automatizaciones/logs"         element={<P><AutomationLogsErrorTracking /></P>} />
        <Route path="/automatizaciones/errores"      element={<P><ErrorAnalysisView /></P>} />

        {/* ✅ NUEVO — Detalle de proyecto n8n */}
        <Route path="/proyectos/:key"  element={<P><ProjectDetailView /></P>} />

        {/* PRIVADO — Workflows */}
        <Route path="/workflow/:id"    element={<P><WorkflowDetailsVariant1 /></P>} />

        {/* PRIVADO — Servicios de cliente */}
        <Route path="/marketing" element={<P><MarketingDashboard /></P>} />
        <Route path="/web"       element={<P><WebProjectsDashboard /></P>} />

        {/* PRIVADO — Soporte */}
        <Route path="/soporte"         element={<P><SupportTicketList /></P>} />
        <Route path="/soporte/chat"    element={<P><TechnicalSupportChat /></P>} />
        <Route path="/soporte/ticket"  element={<P><SupportTicketList /></P>} />
        <Route path="/soporte/ticket/:id"  element={<P><TicketConversationView /></P>} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{
            background: '#0D1B2A', minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '4rem', background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
              <p style={{ color: '#94a3b8' }}>Página no encontrada</p>
              <a href="/" style={{ color: '#007BFF' }}>Volver al inicio</a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}