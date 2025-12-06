# 🌟 HR Workflow Builder

A **modular, scalable Workflow Automation Builder** built using **React,
Vite, TypeScript, and React Flow**.\
This tool enables HR teams to visually design workflows for
**onboarding, approvals, document processing**, and other internal
automations.

It demonstrates strong skills in:

-   ⚛️ Front-end architecture\
-   🔄 Graph state management\
-   🧪 API-driven simulation\
-   🧩 Custom node design\
-   📐 Scalable component structuring

------------------------------------------------------------------------

## 🏗️ Architecture

The project follows a **feature-based architecture**, optimized for
scalability, clarity, and maintainability.

    src/
    │
    ├── api/
    │   └── mockActions.ts              # GET /automations & POST /simulate mocks
    │
    ├── components/
    │   ├── Canvas/
    │   │   ├── WorkflowCanvas.tsx      # Main workflow canvas (React Flow)
    │   │   ├── NodeFormPanel.tsx       # Dynamic node configuration panel
    │   │── nodes/                  # All workflow node types
    │       ├── StartNode.tsx
    │       ├── TaskNode.tsx
    │       ├── ApprovalNode.tsx
    │       ├── AutomatedNode.tsx
    │       ├── EndNode.tsx
    │       └── index.ts                # Node mapping for React Flow
    │
    │   ├── sandbox/
    │   │   └── WorkflowSandbox.tsx     # Workflow simulation/testing module
    │
    │   └── sidebar/
    │       └── Sidebar.tsx             # Optional sidebar UI
    │
    ├── context/
    │   └── WorkflowContext.tsx         # Central workflow graph state manager
    │
    ├── types/
    │   └── workflow.ts                 # Strong TypeScript types for workflows
    │
    ├── utils/
    │   ├── download.ts                 # Export workflow JSON
    │   └── validateWorkflowGraph.ts    # Workflow validation utilities
    │
    ├── App.tsx
    └── main.tsx

------------------------------------------------------------------------

## 🎯 Key Architectural Decisions

### ✔ Feature-Based Structure

Keeps related components, logic, types, and utilities grouped together.

### ✔ WorkflowContext Instead of Redux

Simpler, scalable, and integrates smoothly with React Flow.

### ✔ React Flow for Canvas

Industry-standard library for visual workflow editors.

### ✔ Mock API Layer

Provides realistic API interactions without needing a backend.

### ✔ Dedicated Simulation Sandbox

Isolated module for workflow testing.

------------------------------------------------------------------------

## 🚀 How to Run the Project

### 1. Install dependencies

    npm install

### 2. Start the development server

    npm run dev

### 3. Open the project in browser

    http://localhost:5173

No backend required --- everything runs through mockActions.ts.

------------------------------------------------------------------------

## ✔️ What's Completed

### 🖼️ Workflow Designer

-   Drag & drop nodes\
-   Edge connections\
-   Custom node visuals\
-   MiniMap, zoom, panning

### 📝 Node Editing Panel

-   Title\
-   Description\
-   Assignee / Approver\
-   Due date\
-   Metadata\
-   Automation parameters

### 🧪 Mock API Layer

-   GET /automations\
-   POST /simulate

### 🧰 Simulation Sandbox

-   Validation\
-   Execution logs

### 📦 Utilities + Types

-   Workflow validation\
-   Workflow JSON export

------------------------------------------------------------------------

## 🚧 What I Would Add With More Time

### 🔍 Advanced Graph Validation

Cycle detection, unreachable nodes, missing Start/End.

### 🕒 Visual Timeline Simulation

Animated node execution.

### 💾 Autosave + Versioning

Version history and rollback.

### 📁 Import/Export Workflows

Template sharing.

### 🎨 UI Enhancements

Better icons, animations, spacing.

### 🌐 Real Backend Integration

DB storage, auth, real workflow execution.

------------------------------------------------------------------------
