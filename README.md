🌟 HR Workflow Builder – README

A modular, scalable Workflow Automation Builder built with React, Vite, TypeScript, and React Flow.
This prototype enables HR teams to visually design workflows for onboarding, approvals, document processing, and more.

It demonstrates advanced front-end engineering across:

⚙️ Scalable architecture

🔄 Workflow graph state management

🧩 Reusable custom node components

🧪 Workflow simulation engine

🧪 Mock API integration

🏗️ Architecture

The system is organized using a feature-based architecture to maximize scalability and maintainability.

🔑 Key Architectural Principles
1. Feature-Based Structure (Not Atomic Folders)

Each feature contains its UI, hooks, types, mocks, and utilities — keeping everything modular.

2. Centralized WorkflowContext

A dedicated context manages:

nodes

edges

selection

canvas events

updates & mutations

This avoids Redux boilerplate while remaining scalable.

3. React Flow for Canvas Rendering

Chosen for its production-grade features:

Node/edge rendering

Drag & drop

Zoom & pan

Custom node components

High performance for large graphs

4. Strong TypeScript Models

Each node type includes strict interfaces:

StartNodeData

TaskNodeData

ApprovalNodeData

AutomatedNodeData

EndNodeData

Ensures safe updates and prevents invalid workflow structures.

5. Mock API Layer (Realistic Simulation)

A lightweight mock backend simulates:

/automations — fetches available automated actions

/simulate — returns step-by-step execution logs

No backend needed.

6. Dedicated Workflow Simulation Sandbox

Completely isolated from the canvas, this module:

Serializes the workflow

Validates structure

Runs mock execution

Displays timeline/logs

Keeps design and simulation logic cleanly separated.

🚀 Getting Started
1. Install Dependencies
npm install

2. Start Development Server
npm run dev

3. Open App in Browser
http://localhost:5173


No backend required — everything runs via mock API functions.

🎨 Design Decisions
✨ React Flow for Workflow Canvas

Avoids reinventing graph rendering. React Flow provides battle-tested features for:

Node layout

Connection logic

Custom components

Mini-map / controls

✨ Context Instead of Redux

Used because:

Workflow state is local to this feature

Low boilerplate

Perfect integration with ReactFlow hooks

✨ TypeScript for Node Structures

Strict typing offers:

Predictable form updates

Safer configuration

Fewer runtime bugs

✨ Mock API Instead of Real Backend

Allows rapid prototyping with realistic behavior:

Automation listing

Workflow execution simulation

✨ Dedicated Simulation Sandbox

Prevents mixing workflow editing and execution logic.

✔️ Completed Features
🖼️ Workflow Designer (Core Module)

Drag & drop nodes

Connect / delete edges

Zoom, pan, minimap

Custom visuals for every node type

Persist node positions

Dynamic toolbar actions

📝 Node Editing Panel

Dynamic, type-specific configuration forms:

Title

Description

Metadata fields

Assignee / Approver

Due dates

Automation settings

💻 Mock API Layer

GET /automations returns email/docgen/etc. mock actions

POST /simulate returns workflow execution logs

🧪 Workflow Simulation Sandbox

Full workflow serialization

Validation steps

Simulation log output

Visual result panel

📦 Utilities

Graph validation

Workflow JSON exporter

Reusable node helpers

Custom React Flow hooks

🚧 Future Enhancements (With More Time)
1. Advanced Graph Validator

Cycle detection

Orphan node detection

Missing Start/End validation

Support for branching & parallel flows

2. Visual Execution Timeline

Animated step-by-step node highlighting

State transitions (completed, failed, skipped)

Execution speed control

3. Autosave + Versioning

Local storage autosave

Version history

Rollback feature

4. Import / Export Workflows

Upload workflow JSON

Share workflow templates

Versioned workflow bundles

5. UI Enhancements

Better color palette

Node icons

Hover animations

Improved layout & spacing

6. Real Backend Integration

User authentication

Workflow library storage

Execution engine on server

Activity log database
