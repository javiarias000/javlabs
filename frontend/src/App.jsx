import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ─── PÚBLICAS ─────────────────────────────────────────────────────────
import LandingPage1 from './stitch/landing_page_1/LandingPage1';
import ServicesPageVariant1 from './stitch/services_page_variant_1/ServicesPageVariant1';
import ContactPageVariant1 from './stitch/contact_page_variant_1/ContactPageVariant1';
import PortalLogin from './stitch/portal_login/PortalLogin';

// ─── DASHBOARD ────────────────────────────────────────────────────────
import ClientDashboard from './stitch/client_dashboard/ClientDashboard';
import ClientDashboardOverview from './stitch/client_dashboard_overview/ClientDashboardOverview';
import AutomationPerformanceDashboard from './stitch/automation_performance_dashboard/AutomationPerformanceDashboard';

// ─── AUTOMATIZACIONES ─────────────────────────────────────────────────
import ActiveAutomationsListView from './stitch/active_automations_list_view/ActiveAutomationsListView';
import AutomationManagementTable from './stitch/automation_management_table/AutomationManagementTable';
import AutomationLogicTestView from './stitch/automation_logic_test_view/AutomationLogicTestView';
import AutomationLogsErrorTracking from './stitch/automation_logs_error_tracking/AutomationLogsErrorTracking';
import NewAutomationWizardStep1 from './stitch/new_automation_wizard_step_1/NewAutomationWizardStep1';
import ErrorAnalysisView from './stitch/error_analysis_view/ErrorAnalysisView';

// ─── WORKFLOWS ────────────────────────────────────────────────────────
import WorkflowDetailsVariant1 from './stitch/workflow_details_variant_1/WorkflowDetailsVariant1';
import WorkflowDetailsVariant21 from './stitch/workflow_details_variant_2_1/WorkflowDetailsVariant21';
import WorkflowDetailsVariant22 from './stitch/workflow_details_variant_2_2/WorkflowDetailsVariant22';
import WorkflowDetailsVariant23 from './stitch/workflow_details_variant_2_3/WorkflowDetailsVariant23';

// ─── SOPORTE ──────────────────────────────────────────────────────────
import TechnicalSupportChat from './stitch/technical_support_chat/TechnicalSupportChat';
import TicketConversationView from './stitch/ticket_conversation_view/TicketConversationView';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PÚBLICAS */}
          <Route path="/"                    element={<LandingPage1 />} />
          <Route path="/servicios"           element={<ServicesPageVariant1 />} />
          <Route path="/contacto"            element={<ContactPageVariant1 />} />
          <Route path="/login"               element={<PortalLogin />} />

          {/* DASHBOARD */}
          <Route path="/dashboard"           element={<ClientDashboard />} />
          <Route path="/dashboard/overview"  element={<ClientDashboardOverview />} />
          <Route path="/dashboard/performance" element={<AutomationPerformanceDashboard />} />

          {/* AUTOMATIZACIONES */}
          <Route path="/automatizaciones"           element={<ActiveAutomationsListView />} />
          <Route path="/automatizaciones/tabla"     element={<AutomationManagementTable />} />
          <Route path="/automatizaciones/nueva"     element={<NewAutomationWizardStep1 />} />
          <Route path="/automatizaciones/logica"    element={<AutomationLogicTestView />} />
          <Route path="/automatizaciones/logs"      element={<AutomationLogsErrorTracking />} />
          <Route path="/automatizaciones/errores"   element={<ErrorAnalysisView />} />

          {/* WORKFLOWS */}
          <Route path="/workflow/v1"         element={<WorkflowDetailsVariant1 />} />
          <Route path="/workflow/v2"         element={<WorkflowDetailsVariant21 />} />
          <Route path="/workflow/v2-2"       element={<WorkflowDetailsVariant22 />} />
          <Route path="/workflow/v2-3"       element={<WorkflowDetailsVariant23 />} />

          {/* SOPORTE */}
          <Route path="/soporte/chat"        element={<TechnicalSupportChat />} />
          <Route path="/soporte/ticket"      element={<TicketConversationView />} />

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
