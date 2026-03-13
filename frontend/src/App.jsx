import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import AboutPage from './stitch/about_page/AboutPage';
import LandingPage1 from './stitch/landing_page_1/LandingPage1';
import ServicesPageVariant1 from './stitch/services_page_variant_1/ServicesPageVariant1';
import ContactPageVariant1 from './stitch/contact_page_variant_1/ContactPageVariant1';
import PricingPage from './stitch/pricing_page/PricingPage';
import PortalLogin from './stitch/portal_login/PortalLogin';
import ClientDashboard from './stitch/client_dashboard/ClientDashboard';
import ClientDashboardOverview from './stitch/client_dashboard_overview/ClientDashboardOverview';
import AutomationPerformanceDashboard from './stitch/automation_performance_dashboard/AutomationPerformanceDashboard';
import ActiveAutomationsListView from './stitch/active_automations_list_view/ActiveAutomationsListView';
import AutomationManagementTable from './stitch/automation_management_table/AutomationManagementTable';
import AutomationLogicTestView from './stitch/automation_logic_test_view/AutomationLogicTestView';
import AutomationLogsErrorTracking from './stitch/automation_logs_error_tracking/AutomationLogsErrorTracking';
import NewAutomationWizardStep1 from './stitch/new_automation_wizard_step_1/NewAutomationWizardStep1';
import ErrorAnalysisView from './stitch/error_analysis_view/ErrorAnalysisView';
import WorkflowDetailsVariant1 from './stitch/workflow_details_variant_1/WorkflowDetailsVariant1';
import TechnicalSupportChat from './stitch/technical_support_chat/TechnicalSupportChat';
import TicketConversationView from './stitch/ticket_conversation_view/TicketConversationView';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const P = ({ children }) => <PrivateRoute>{children}</PrivateRoute>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* PÚBLICO */}
          <Route path="/"         element={<LandingPage1 />} />
          <Route path="/servicios" element={<ServicesPageVariant1 />} />
          <Route path="/nosotros"  element={<AboutPage />} />
          <Route path="/contacto"  element={<ContactPageVariant1 />} />
          <Route path="/precios"  element={<PricingPage />} />
          <Route path="/login"     element={<PortalLogin />} />

          {/* PRIVADO — Portal */}
          <Route path="/dashboard"              element={<P><ClientDashboard /></P>} />
          <Route path="/dashboard/overview"     element={<P><ClientDashboardOverview /></P>} />
          <Route path="/dashboard/performance"  element={<P><AutomationPerformanceDashboard /></P>} />

          {/* PRIVADO — Automatizaciones */}
          <Route path="/automatizaciones"          element={<P><ActiveAutomationsListView /></P>} />
          <Route path="/automatizaciones/tabla"    element={<P><AutomationManagementTable /></P>} />
          <Route path="/automatizaciones/nueva"    element={<P><NewAutomationWizardStep1 /></P>} />
          <Route path="/automatizaciones/logica"   element={<P><AutomationLogicTestView /></P>} />
          <Route path="/automatizaciones/logs"     element={<P><AutomationLogsErrorTracking /></P>} />
          <Route path="/automatizaciones/errores"  element={<P><ErrorAnalysisView /></P>} />

          {/* PRIVADO — Workflows */}
          <Route path="/workflow/v1"   element={<P><WorkflowDetailsVariant1 /></P>} />

          {/* PRIVADO — Soporte */}
          <Route path="/soporte/chat"   element={<P><TechnicalSupportChat /></P>} />
          <Route path="/soporte/ticket" element={<P><TicketConversationView /></P>} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ background: '#0D1B2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem', background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
                <p style={{ color: '#94a3b8' }}>Página no encontrada</p>
                <a href="/" style={{ color: '#007BFF' }}>Volver al inicio</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
