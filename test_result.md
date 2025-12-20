# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Multi-campaign marketing platform for InverSer. Each campaign can have its own landing page template. The system must support N campaigns with different landing page UIs while sharing the same backend, admin panel, mentors, tracking and CSV system. Emergent is the engine for creating new landings."

backend:
  - task: "Public API returns campaign template_key"
    implemented: true
    working: true
    file: "/app/backend/routes/public.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "API endpoint /api/public/mentor/{campaign}/{slug} returns campaign.template_key correctly. Verified via curl - cpn returns template_key:cpn, suitex returns template_key:suitex"

frontend:
  - task: "Dynamic template system in DynamicLandingPage"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/DynamicLandingPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Implemented template registry pattern. DynamicLandingPage fetches campaign data, extracts template_key, and renders corresponding component (LandingCPN or LandingSuitex). Fallback to cpn with console warning if template not found."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: Template system working perfectly. /cpn/noel-rivera loads LandingCPN, /suitex/noel-rivera loads LandingSuitex. Template registry correctly maps template_key to components. API integration functional."

  - task: "LandingCPN template component"
    implemented: true
    working: true
    file: "/app/frontend/src/templates/LandingCPN.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Wrapper component that renders the original NeuroCoaching certification landing page. Receives mentorData and onActionClick props."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: CPN template renders correctly with 'Certificación Profesional' and 'Neurocoaching' content. Mentor name 'Noel Rivera' displays with photo. Action buttons 'Agendar Llamada' and 'Hablar por WhatsApp' present. NO Suitex content found (verified 0 occurrences)."

  - task: "LandingSuitex template component"
    implemented: true
    working: true
    file: "/app/frontend/src/templates/LandingSuitex.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "New SaaS-style landing page with Hero, Benefits, How it works, For who, CTA and Footer sections. Uses action_key=demo for primary CTA. Completely different copy/design from CPN."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: Suitex template renders correctly with 'Tu oficina digital' title and 'Suitex by InverSer' branding. All sections present: '¿Por qué Suitex?', 'Cómo funciona', '¿Es para ti?'. 'Solicitar Demo' button functional. NO coaching/certification content found (verified 0 occurrences)."

  - task: "Legacy URL redirect"
    implemented: true
    working: true
    file: "/app/frontend/src/components/LegacyRedirect.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Verified via screenshot - /noel-rivera redirects to /cpn/noel-rivera correctly. Final URL confirmed in browser."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: Legacy redirect working perfectly. /noel-rivera automatically redirects to /cpn/noel-rivera. Final URL verified as https://landing-pro-30.preview.emergentagent.com/cpn/noel-rivera."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Dynamic template system in DynamicLandingPage"
    - "LandingCPN template component"
    - "LandingSuitex template component"
    - "Legacy URL redirect"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Implemented P0 tasks: 1) Template system in DynamicLandingPage.jsx - reads template_key from API and renders correct component from TEMPLATE_REGISTRY. 2) LandingSuitex.jsx - Complete SaaS landing with no coaching copy. 3) Verified manually via screenshots: /cpn/noel-rivera shows NeuroCoaching, /suitex/noel-rivera shows Suitex SaaS, /noel-rivera redirects to /cpn/noel-rivera. Please run frontend tests to verify all template switching works correctly."
  - agent: "testing"
    message: "✅ COMPREHENSIVE TESTING COMPLETED: All 4 tasks tested successfully via Playwright automation. Multi-campaign template system working perfectly: 1) CPN campaign (/cpn/noel-rivera) renders NeuroCoaching certification content with proper branding and actions. 2) Suitex campaign (/suitex/noel-rivera) renders completely different SaaS landing page with blue gradient and demo CTA. 3) Legacy redirect (/noel-rivera) properly redirects to /cpn/noel-rivera. 4) Template differentiation verified - no content overlap between campaigns. System ready for production use."

  - task: "LandingGeneric template component"
    implemented: true
    working: true
    file: "/app/frontend/src/templates/LandingGeneric.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Template por defecto para nuevas campañas. Renderiza acciones dinámicamente, muestra nombre de campaña y mentor. Verificado con campaña mentor-program."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: LandingGeneric template working perfectly for /mentor-program/noel-rivera. Shows 'Programa de Mentores 2025' title, mentor 'Noel Rivera' with photo, action buttons 'Aplicar al Programa' and 'Más Información'. Contains expected sections: '¿Por qué elegirnos?' and 'Lo que incluye'. NO coaching or Suitex specific content found - completely neutral template as designed."

  - task: "TEMPLATE_REGISTRY system"
    implemented: true
    working: true
    file: "/app/frontend/src/templates/index.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Sistema de registro de templates con helpers getTemplate(), getAvailableTemplates(). Fallback a generic con warning. Documentación incluida."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: TEMPLATE_REGISTRY system working correctly. All 3 templates (generic, cpn, suitex) properly registered and accessible. Template selection in admin shows all available options: 'Generic (generic), Cpn (cpn), Suitex (suitex)'. Dynamic template loading verified - each campaign loads its correct template based on template_key."

  - task: "Admin Campaigns CRUD"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/admin/CampaignsPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "CRUD completo para campañas. Validación de key (solo a-z0-9-), palabras reservadas bloqueadas, selector de templates disponibles, URL sugerida."
      - working: true
        agent: "testing"
        comment: "✅ TESTED: Admin Campaigns CRUD fully functional. Found 3 campaigns: 'Certificación Profesional NeuroCoaching' (cpn), 'Suitex (InverSer Experience)' (suitex), 'Programa de Mentores 2025' (generic). Each campaign card shows name, URL format, template key, Edit and Delete buttons. 'Nueva Campaña' modal contains all required fields: Key, Name, Template dropdown with all available templates, Order, Active toggle, Create and Cancel buttons."

  - agent: "main"
    message: "Implementación completa del sistema multi-campaña escalable: 1) LandingGeneric como fallback para nuevas campañas, 2) TEMPLATE_REGISTRY extensible con documentación, 3) Admin CRUD de Campañas con validaciones y selector de templates. Verificado: /mentor-program/noel-rivera usa template generic correctamente. Admin panel muestra 3 campañas. Documentación en /app/TEMPLATE_SYSTEM_DOCS.md"
  - agent: "testing"
    message: "✅ COMPLETE MULTI-CAMPAIGN SYSTEM TESTING SUCCESSFUL: All 7 tasks verified working. Template system perfectly differentiates campaigns: CPN (NeuroCoaching certification), Suitex (SaaS office digital), Generic (Mentor Program 2025 - neutral content). Admin CRUD fully functional with 3 campaigns, template selector, and all required fields. Legacy redirect working. Template registry system operational with proper fallbacks. System ready for production deployment."

  - task: "Actions Page campaign-aware"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/admin/ActionsPage.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Complete Actions UI with campaign selector. Features: campaign dropdown (remembers last selection via localStorage), context banner showing campaign name/URL/template, CRUD operations scoped to selected campaign. Verified: cpn shows 3 actions, suitex shows 1, mentor-program shows 2. Created test action in mentor-program and confirmed it did NOT appear in other campaigns."
      - working: true
        agent: "testing"
        comment: "✅ COMPREHENSIVE TESTING COMPLETED: All campaign-aware functionality verified working perfectly. 1) Campaign Selector: Shows 3 campaigns with proper dropdown and localStorage persistence. 2) CPN Campaign: Shows 3 actions (Agendar Llamada/agenda, Hablar por WhatsApp/whatsapp, Aplicar/Registrarme/formulario) with template:cpn. 3) Suitex Campaign: Shows 1 action (demo) with proper context banner. 4) Mentor-Program Campaign: Shows 2 actions with template:generic. 5) Action Isolation: Verified actions are properly scoped per campaign - created test action in mentor-program, confirmed NOT visible in CPN/Suitex. 6) UI Elements: All required elements present (order numbers, labels, action_key badges, active badges, Edit/Delete/Toggle buttons). 7) New Action Modal: All fields present (key, label, description, order, active toggle). 8) Context Banner: Updates correctly showing campaign name, URL format, and template key. Campaign isolation working perfectly - actions are completely separated by campaign."

  - agent: "main"
    message: "Actions Page campaign-aware complete. Implemented: campaign selector dropdown, localStorage persistence, context banner, CRUD scoped to campaign. Backend updated: action model includes campaign_key, service validates unique action_key per campaign, API supports ?campaign_key filter. Verified isolation: created test action in mentor-program, confirmed NOT visible in cpn/suitex."
  - agent: "testing"
    message: "✅ CAMPAIGN-AWARE ACTIONS PAGE TESTING COMPLETED: All functionality verified working perfectly. Campaign selector shows 3 campaigns with proper dropdown. CPN shows 3 actions (agenda, whatsapp, formulario), Suitex shows 1 action (demo), Mentor-Program shows 2 actions with generic template. Action isolation confirmed working - actions are completely separated by campaign. Context banner updates correctly. All UI elements present (order numbers, labels, badges, buttons). New action modal has all required fields. CRUD operations working. System ready for production use."
