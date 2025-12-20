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

user_problem_statement: "Multi-campaign marketing platform for InverSer. Each campaign can have its own landing page template. The system must support different UIs for different campaigns while sharing the same backend, admin panel, mentors, tracking and CSV system."

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
