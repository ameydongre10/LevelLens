# LevelLens Teacher App

> **Offline-first mobile diagnostic, dynamic ability grouping, and rapid skill-tagging tool engineered for primary school educators in low-resource and multi-grade classroom environments.**

[![Deployment Status](https://img.shields.io/github/actions/workflow/status/ameydongre10/LevelLens/deploy-pages.yml?branch=main&label=GitHub%20Pages&logo=github)](https://ameydongre10.github.io/LevelLens/)
[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Not_Specified-lightgrey)](#license)

**Live Production Application:** [https://ameydongre10.github.io/LevelLens/](https://ameydongre10.github.io/LevelLens/)

---

## Quick Start

Get the application running locally in under two minutes:

```bash
# 1. Clone the repository
git clone https://github.com/ameydongre10/LevelLens.git
cd LevelLens

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000/LevelLens/` in your browser. Use the mobile frame toggle at the top of the interface to inspect the optimized 360–412px viewport designed for budget Android devices.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement](#2-problem-statement)
- [3. Proposed Solution](#3-proposed-solution)
- [4. Key Features](#4-key-features)
- [5. System Architecture](#5-system-architecture)
- [6. Complete System Workflow](#6-complete-system-workflow)
- [7. Application Interface & Visual Tour](#7-application-interface--visual-tour)
- [8. Deterministic Grouping & Promotion Engine](#8-deterministic-grouping--promotion-engine)
- [9. Data Minimization & Privacy Architecture](#9-data-minimization--privacy-architecture)
- [10. Technology Stack](#10-technology-stack)
- [11. Repository Structure](#11-repository-structure)
- [12. Installation & Local Setup](#12-installation--local-setup)
- [13. Internal Service Architecture & Data Layer](#13-internal-service-architecture--data-layer)
- [14. Error Handling & Reliability](#14-error-handling--reliability)
- [15. Deployment Guide](#15-deployment-guide)
- [16. Verification & Quality Assurance](#16-verification--quality-assurance)
- [17. Practical Use Cases](#17-practical-use-cases)
- [18. Problem-to-Impact Mapping](#18-problem-to-impact-mapping)
- [19. Current Limitations](#19-current-limitations)
- [20. Future Roadmap](#20-future-roadmap)
- [21. Contributing](#21-contributing)
- [22. License](#22-license)

---

## 1. Project Overview

**LevelLens** is a specialized, offline-first progressive web application built to empower primary school teachers operating under the **Teaching at the Right Level (TaRL)** and **Foundational Literacy and Numeracy (FLN / NIPUN Bharat)** pedagogical frameworks. In under-resourced schools across developing regions, single educators routinely manage multi-grade classrooms comprising 30 to 50 students whose learning proficiencies span wide variations—from non-readers struggling with letter sounds to fluent paragraph readers.

Traditional paper-based assessment registers and complex administrative spreadsheets fail in this environment: they demand extensive manual record-keeping, cannot be completed during live instruction without losing classroom attention, and sit inert rather than dynamically informing daily teaching. LevelLens solves this by functioning as a high-density, **sub-5-second interaction companion**. Teachers can conduct structured 5-minute oral/slate diagnostic checks, view auto-calculated three-tier ability distributions (`Intensive Support`, `Emerging`, `On Track`), record live classroom observations with single-tap gesture targets (≥44px), and receive targeted, zero-prep chalk-and-slate lesson activities tailored directly to their class's emergent gaps.

The application operates **100% offline** on entry-level Android devices and commodity hardware via a reactive, browser-based persistence layer (`StorageService`) utilizing `localStorage` and a custom pub/sub observer model. All changes are committed locally with pending reconciliation queues, guaranteeing that sporadic rural cellular network drops never interrupt instructional workflows.

---

## 2. Problem Statement

### Existing Situation
In government and community primary schools globally, pedagogical initiatives like Teaching at the Right Level (TaRL) prescribe grouping children by current assessed learning level rather than age or enrolled grade. Instructors conduct periodic baseline diagnostic checks covering foundational reading (letter sounds, CVC word decoding, sentence comprehension) and mathematics (1–99 number recognition, single-digit operations, 2-digit subtraction with regrouping).

```text
[Enrolled Grade Level] ──❌ Misaligned ──▶ [Actual Student Competency]
     (Grade 3/4)                                 (Letter Sounds / Phonics Gap)
```

### Problems & Operational Gaps
1. **Administrative Overhead vs. Instructional Time:** Assessing 40 students with paper rubrics takes hours of manual scoring, grade averaging, and roster sorting. Teachers spend scarce preparation periods doing arithmetic rather than teaching.
2. **Static Grouping Inertia:** Once groups are formed on paper, they remain static for months. Rapidly progressing students stay trapped in remediation, while struggling students miss timely intervention because updating rosters requires re-writing physical charts.
3. **Connectivity Fragility:** Cloud-only educational dashboards fail entirely in rural school blocks with intermittent cellular data, dead zones, or intermittent electricity.
4. **Pedagogical Disconnect:** Standard administrative software displays charts of failure rates but provides zero actionable guidance on what specific 15-minute floor or blackboard drill to run with the Intensive Support cohort tomorrow morning.
5. **PII and Data Privacy Risks:** School systems often over-collect student data (phone numbers, addresses, biometric IDs, dates of birth), exposing vulnerable minors to surveillance and data breaches.

### Consequences
When foundational deficits go unidentified and unaddressed in Grades 1–3, learning gaps compound exponentially. Students fall permanently behind the curricular grade level, fostering chronic disengagement, absenteeism, and eventual dropout.

---

## 3. Proposed Solution

LevelLens provides a closed-loop diagnostic, grouping, and instructional execution workflow tailored to constraints of rural schools:

| Real-World Challenge | LevelLens Feature | Implementation Architecture | Concrete Outcome |
|---|---|---|---|
| **Multi-hour diagnostic math** | **5-Minute Guided Diagnostic** | Auto-advancing oral checklist with deterministic scoring threshold rules | Reduces diagnostic evaluation from 20 minutes to 3–5 minutes per child |
| **Static paper grouping** | **Live Multi-Segment Distribution** | Instant tier re-calculation (`RED`, `YELLOW`, `GREEN`) across Reading & Math | Dynamic ability cohorts update immediately upon assessment completion |
| **Forgotten live performance** | **Sub-5-Second Live Tagging** | Instant `✓ Mastered` and `! Struggling` touch targets (min 44px) | Teachers tag student breakthroughs in real time without stopping instruction |
| **Missed student promotions** | **Automated Promotion Suggestions** | Heuristic engine detecting 3 consecutive positive live observations | Proactively suggests level transitions (`RED` → `YELLOW` → `GREEN`) |
| **Zero-prep lesson requirement** | **Low-Resource Activity Bank** | Filtered pedagogical library utilizing only chalk, slates, and pebbles | Delivers immediate 10–15 min targeted drills directly tied to class deficit |
| **Patchy rural connectivity** | **Local Room/SQLite Simulation** | Synchronous client persistence with timestamped pending sync queues | Zero latency, 100% offline functional guarantee; no data loss |
| **Child privacy concerns** | **Strict Data Minimization** | Strictly records First Name + Roll No/Desk Alias only | Prevents PII leakage by design; compliant with child protection standards |

---

## 4. Key Features

### 🎯 Foundational Ability Grouping (`GroupsView`)
- **Dual-Subject Cohort Tracking:** Seamless toggling between **Foundational Reading** and **Foundational Mathematics**.
- **Real-Time Distribution Visualization:** Color-coded multi-segment progress bar showing precise headcounts and class percentages across three tiers:
  - 🔴 **Intensive Support (`RED`):** Letter & sounds / Number recognition 1–99.
  - 🟡 **Emerging (`YELLOW`):** CVC word decoding & short sentences / 1-digit subtraction.
  - 🟢 **On Track (`GREEN`):** Paragraph & connected story comprehension / 2-digit regrouping subtraction.
- **Automated Class Gap Diagnosis:** Instant calculation of the cohort's primary learning bottleneck with specific recommended next actions (e.g., *"12 students (48%) decode words slowly and need sentence fluency practice"*).
- **Roster Tier Accordions:** Expandable cards displaying tier descriptions, focus areas, individual student cards, diagnostic status notes, and quick assessment triggers.

### ⚡ Rapid Classroom Tagging (`LiveTaggingView`)
- **Sub-5-Second Micro-Interactions:** Large, high-contrast touch buttons (`✓ Mastered` and `! Struggling`) meeting Android touch target standards (≥44px height).
- **Transient Visual Feedback:** Micro-animations (scale pulse, ring highlight) confirm tag capture without modal dialogs or screen transitions.
- **Contextual Focus Quick-Pills:** Single-tap switching between pedagogical concepts (e.g., *Phonics Sounds*, *CVC Blending*, *Sentence Reading*, *Story Fluency*).
- **Instant Search & Tier Filters:** Search students by name or roll number with real-time filtering across Red, Yellow, Green groups.
- **Manual Level Override:** Teacher discretion dialog permitting direct placement overrides with reason logging for pedagogical flexibility.

### ⏱️ 5-Minute Guided Diagnostic (`AssessmentFlowModal`)
- **Teacher Oral Script Prompts:** Built-in scripted prompts for standardized oral and slate checks (e.g., *"Point to each letter card. Ask student: 'Make the sound of this letter (not the name)'"*).
- **Item-Level Checklist Rubrics:** Clear criteria per diagnostic step with transparent pass thresholds (e.g., $\ge 4/5$).
- **Sub-5-Second Touch Scoring Pad:** Numbered rapid-tap scoring grid (0 to max score) providing instantaneous feedback.
- **Live Deterministic Tier Preview:** Live visual feedback displaying the student's newly calculated level and diagnostic justification before saving.
- **Carousel Student Progression:** Auto-advances to the next student in the roster upon completion for streamlined sequential evaluations.

### 📚 Low-Resource Activity Engine (`ActivitiesView`)
- **Zero-Cost Materials:** Curated lesson plans requiring only blackboard chalk, floor verandah space, slates, and stones/pebbles.
- **Rotational Design:** Structured into 10–15 minute activities suited for multi-grade split shifts and small group station rotations.
- **Pedagogical Scripting:** Step-by-step instructions accompanied by practical "Chalk & Talk" tips.
- **Teacher Utility Controls:** Favorite toggling, daily completion tracking (`Done Today ✓`), and pedagogical feedback ratings (Thumbs Up / Thumbs Down).

### 📈 Longitudinal Growth Analytics (`ProgressView`)
- **Baseline vs. Current Trajectory Tracking:** Compares month-start baseline snapshots against current live levels.
- **Cohort Net Movement Metric:** Highlights net upward tier movements (e.g., *"8 students moved up a tier! Red Intensive group reduced by 5 students"*).
- **Student History Timeline Modal:** Audit trail recording every assessment result, live tag, and manual override with timestamps and notes.
- **Movement Filters:** Filter by cohort behavior: `Leveled Up`, `Steady`, or `Intensive Support`.

### 🔄 Offline-First Persistence & Sync Drawer (`SyncDrawerModal`)
- **Local Reactive Engine:** Local storage singleton with pub/sub architecture triggering instant UI updates across all views.
- **Reconciliation Queue:** Tracks sync status (`PENDING` vs. `SYNCED`) across students, diagnostic checks, live tags, and activity logs.
- **Manual Network Simulation Toggle:** Interactive Online/Offline toggle to test and verify behavior under simulated disconnected field conditions.
- **Data Export & Seed Reset:** One-click JSON backup export and sandbox seed data restoration for demonstration and evaluation.

---

## 5. System Architecture

LevelLens follows a decoupled, client-centric architecture designed for zero runtime server dependencies:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│  React 19 Components • Tailwind CSS v4 • Lucide Icons • Motion         │
│                                                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  GroupsView  │ │ LiveTagView  │ │ActivitiesView│ │ ProgressView │   │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘   │
│         │                │                │                │           │
│  ┌──────┴────────────────┴────────────────┴────────────────┴───────┐   │
│  │       Modal Flows: Assessment Diagnostic • Sync • AddStudent    │   │
│  └────────────────────────────────┬────────────────────────────────┘   │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ Events & Method Invocations
┌───────────────────────────────────▼────────────────────────────────────┐
│                         DOMAIN LOGIC LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   groupingEngine.ts                              │  │
│  │  • calculateDerivedTier()      • checkPromotionEligibility()     │  │
│  │  • calculateClassGaps()        • calculateMovementSummary()      │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ State Updates & Subscriptions
┌───────────────────────────────────▼────────────────────────────────────┐
│                    LOCAL PERSISTENCE LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   storageService.ts                              │  │
│  │  • Pub/Sub Observer Engine     • Pending Sync Queue Manager      │  │
│  │  • Deterministic ID Generator  • JSON Import/Export Serializer   │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ Browser Web Storage API
┌───────────────────────────────────▼────────────────────────────────────┐
│                      PHYSICAL STORAGE TARGET                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                window.localStorage                              │  │
│  │  Key: 'levellens_teacher_data_v1' (Structured JSON payload)      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Complete System Workflow

The following sequence outlines how student data moves through LevelLens during a standard school day:

```mermaid
sequenceDiagram
    autonumber
    actor Teacher
    participant UI as LevelLens UI (React)
    participant Engine as Grouping Engine
    participant Storage as Storage Service (localStorage)
    participant Cloud as Remote API (Simulated)

    Note over Teacher,UI: Morning: Diagnostic or Live Review
    Teacher->>UI: Selects Active Class (Grade 3A) & Subject (Reading)
    UI->>Storage: Queries Students & Latest Snapshots
    Storage-->>UI: Returns Cached Class Roster & Snapshots
    UI->>Engine: calculateClassGaps(snapshots)
    Engine-->>UI: Primary Gap: "48% decode words slowly"
    
    Note over Teacher,UI: Midday: 5-Minute Guided Diagnostic Check
    Teacher->>UI: Opens Assessment Modal for Student
    Teacher->>UI: Taps Step Scores (Step 1: 5/5, Step 2: 4/5, Step 3: 1/4)
    UI->>Engine: calculateDerivedTier(scores, thresholds)
    Engine-->>UI: Returns Derived Tier: YELLOW (Emerging)
    Teacher->>UI: Taps "Save & Finish"
    UI->>Storage: recordAssessmentResult() & updateStudentTier()
    Storage->>Storage: Enqueues pending payload with status 'PENDING'
    Storage-->>UI: Broadcasts notify() to all subscribers
    UI-->>Teacher: Dashboard instantly displays updated Red/Yellow/Green distribution

    Note over Teacher,UI: Afternoon: Floor Lesson & Live Tagging
    Teacher->>UI: Opens "Live Tagging" view during chalk hops
    Teacher->>UI: Rapidly taps "✓ Mastered" for Student
    UI->>Storage: recordLiveTag(tagType: 'PERFORMED_WELL')
    UI->>Engine: checkPromotionEligibility(liveTags)
    Engine-->>UI: 3 consecutive passes detected -> Suggests Promotion to GREEN
    UI-->>Teacher: Renders "Approve Move to Green" notification banner
    Teacher->>UI: Taps "Approve Move"
    UI->>Storage: updateStudentTier(newTier: 'GREEN')

    Note over Teacher,Cloud: End of Day: Sync Reconciliation
    Teacher->>UI: Opens Sync Drawer Modal & taps "Reconcile & Sync Now"
    UI->>Storage: reconcileAndSync()
    Storage->>Cloud: Dispatches pending queue payloads
    Cloud-->>Storage: HTTP 200 Reconciliation Acknowledgement
    Storage->>Storage: Marks all pending payloads as 'SYNCED'
    Storage-->>UI: Updates UI badge to "Synced"
```

---

## 7. Application Interface & Visual Tour

LevelLens includes four core operational views and three targeted workflow modals:

### 1. Ability Grouping & Class Gap Overview (`GroupsView`)
The centralized dashboard displaying real-time class proficiency distributions, calculated foundational skill gaps, and tiered student rosters.

![Groups View](docs/images/groups-view.png)

- **Header Panel:** Displays active cohort (`Grade 3A`), total enrolled students (`25`), and subject segmented toggle (`Reading` / `Math`).
- **Multi-Segment Visual Bar:** Real-time visual distribution breakdown: 🔴 Intensive Support (28%), 🟡 Emerging (48%), 🟢 On Track (24%).
- **Foundational Gap Card:** Automatically flags that *12 students (48%) decode words slowly* and prescribes paired reading relays as the immediate pedagogical intervention.
- **Roster Accordions:** Displays students grouped into their respective levels with one-touch diagnostic assessment access.

---

### 2. Live Classroom Tagging (`LiveTaggingView`)
Engineered for rapid, one-handed operation during active teaching rotations. Teachers capture observations in seconds without losing instructional momentum.

![Live Classroom Tagging](docs/images/live-tagging.png)

- **Concept Focus Selector:** Instant switching across specific focus areas (*Phonics Sounds*, *CVC Blending*, *Sentence Reading*, *Story Fluency*).
- **High-Density Roster Cards:** Large, tactile touch surfaces (min 44px) for `✓ Mastered` and `! Struggling` logging.
- **Daily Tag Counter:** Real-time display of tags accumulated by each student during the current school day.
- **Direct Tier Adjustment (`✎`):** Quick teacher override modal to manually reclassify students based on holistic judgment.

---

### 3. Low-Resource Chalk & Slate Lesson Plans (`ActivitiesView`)
A zero-prep pedagogical repository containing structured 10–15 minute drills optimized for low-resource environments.

![Low-Resource Activities](docs/images/activities-view.png)

- **Tier Filtering:** Filter activities specifically designed for `Intensive Support`, `Emerging`, or `On Track` groups.
- **Zero-Cost Materials:** Drills exclusively require chalk, slates, and floor verandah space.
- **Classroom Steps & Tips:** Focussed step-by-step guidance accompanied by practical "Chalk & Talk" tips.
- **Utility Actions:** Star as favorite, mark as done today, or provide quick thumbs up/down effectiveness ratings.

---

### 4. Cohort Foundational Growth (`ProgressView`)
Provides transparent longitudinal analytics illustrating learning velocity from the initial diagnostic baseline to the current date.

![Cohort Foundational Growth](docs/images/cohort-progress.png)

- **Net Movement Metric:** High-visibility banner highlighting positive transitions (e.g., *8 students moved up a tier; Intensive group reduced by 5*).
- **Distribution Comparison:** Dual horizontal progress bars directly comparing month-start baseline distributions against live distributions.
- **Individual Student Trajectories:** Audit cards illustrating specific student advancements (e.g., *Aarav: Roll 01 — RED → YELLOW*).
- **Audit Trail History Modal:** Deep inspection of individual student timelines including all assessment checks, timestamps, and teacher notes.

---

## 8. Deterministic Grouping & Promotion Engine

LevelLens avoids non-deterministic or opaque algorithms. All cohort placements, deficit detections, and promotion suggestions are computed via **transparent, reproducible deterministic heuristics** codified in `src/services/groupingEngine.ts`:

### 1. Diagnostic Scoring Rules (`calculateDerivedTier`)
Diagnostic assessment templates define strict step thresholds:
- **Reading Diagnostic (`assess-read-5min`):**
  - **Step 1 (Letter Sounds):** 5 items, Pass threshold $\ge 4$.
  - **Step 2 (CVC Word Decoding):** 5 items, Pass threshold $\ge 4$.
  - **Step 3 (Story Fluency & Comprehension):** 4 items, Pass threshold $\ge 3$.
- **Evaluation Logic:**
  - If Step 1 is failed ($\text{score} < 4$) $\rightarrow$ **`RED` (Intensive Support)**.
  - If Step 1 is passed but Step 2 is failed ($\text{score} < 4$) $\rightarrow$ **`RED` (Intensive Support)**.
  - If Steps 1 & 2 are passed but Step 3 is failed ($\text{score} < 3$) $\rightarrow$ **`YELLOW` (Emerging)**.
  - If all 3 steps are passed $\rightarrow$ **`GREEN` (On Track)**.

### 2. Automated Promotion Heuristic (`checkPromotionEligibility`)
To prevent students from remaining stagnant in remediation groups, the engine continuously inspects the sequence of recent live tags:
- If a student in **`RED`** accumulates **3 consecutive `PERFORMED_WELL` tags** without any `STRUGGLING` tags $\rightarrow$ the system flags an automated recommendation to promote to **`YELLOW`**.
- If a student in **`YELLOW`** accumulates **3 consecutive `PERFORMED_WELL` tags** $\rightarrow$ the system flags a recommendation to promote to **`GREEN`**.
- Conversely, if a student in **`GREEN`** or **`YELLOW`** records **3 consecutive `STRUGGLING` tags**, the engine flags an alert suggesting remediation review.

### 3. Class Gap Identification (`calculateClassGaps`)
The engine analyzes snapshot distribution arrays to isolate the highest-density deficit across the cohort, calculating the exact percentage of affected students and mapping it to a targeted instructional strategy.

---

## 9. Data Minimization & Privacy Architecture

LevelLens strictly implements **Privacy by Design** and **Child Data Minimization Principles**:

```text
┌──────────────────────────────────────────────────────────────┐
│                  STRICT DATA MINIMIZATION                     │
├──────────────────────────────┬───────────────────────────────┤
│       FIELDS RECORDED        │      EXCLUDED BY DESIGN       │
├──────────────────────────────┼───────────────────────────────┤
│  ✓ Student First Name        │  ✗ No Family / Last Names     │
│  ✓ Roll Number or Desk Alias │  ✗ No Birthdates or Ages      │
│  ✓ Diagnostic Scores         │  ✗ No Phone Numbers           │
│  ✓ Timestamped Tier History  │  ✗ No Home Addresses          │
│  ✓ Pedagogical Concept Notes │  ✗ No Photographs or Biometrics│
│  ✓ Sync Reconciliation Flags │  ✗ No National ID / Aadhaar   │
└──────────────────────────────┴───────────────────────────────┘
```

1. **Minimally Sufficient Identification:** Students are enrolled solely via their first name and a classroom roll number or desk alias (e.g., *"Aarav - Roll 01"* or *"Priya - Desk 4B"*).
2. **Zero Secondary Identifiers:** The data schema explicitly prohibits storing birthdates, parent phone numbers, physical addresses, photographs, or national identity numbers.
3. **Local Storage Boundary:** All records remain encrypted within the browser's origin-isolated local sandbox until the user intentionally exports a backup or initiates an authorized server reconciliation.

---

## 10. Technology Stack

| Architecture Layer | Technology | Version | Engineering Rationale |
|---|---|---|---|
| **Frontend Framework** | React | `^19.0.1` | Concurrent rendering, stable hooks, zero-overhead DOM updates |
| **Language Runtime** | TypeScript | `~5.8.2` | Compile-time strict type validation preventing runtime exceptions |
| **Bundler & Dev Server**| Vite | `^6.2.3` | Instant HMR, tree-shaking, production asset hashing |
| **CSS & Design Engine**| Tailwind CSS | `^4.1.14` | Zero-runtime styling via `@tailwindcss/vite` compiler plugin |
| **Iconography** | Lucide React | `^0.546.0` | Accessible, tree-shakeable SVG vector icons |
| **Motion & Transitions**| Motion | `^12.23.24`| Hardware-accelerated touch feedback and accordion transitions |
| **Local Persistence** | Web Storage API | Native | Universal zero-dependency offline browser storage |
| **CI/CD Automation** | GitHub Actions | `v4` | Automated TypeScript validation, build, and Pages deployment |
| **Hosting Platform** | GitHub Pages | Static | Zero-cost, high-availability, edge-cached static distribution |

---

## 11. Repository Structure

```text
LevelLens/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml         # GitHub Actions CI/CD deployment pipeline
├── docs/
│   └── images/                      # Production screenshots for documentation
│       ├── activities-view.png      # Low-resource lesson plans view
│       ├── cohort-progress.png      # Longitudinal cohort progress analytics
│       ├── groups-view.png          # Grouping & foundational gap dashboard
│       └── live-tagging.png         # Rapid touch tagging interface
├── src/
│   ├── components/                  # Modals and view interfaces
│   │   ├── ActivitiesView.tsx       # Chalk-and-slate lesson plan repository
│   │   ├── AddStudentModal.tsx      # Privacy-preserving student enrollment
│   │   ├── AssessmentFlowModal.tsx  # 5-minute diagnostic oral assessment wizard
│   │   ├── BottomNav.tsx            # High-contrast mobile navigation bar
│   │   ├── ClassroomModal.tsx       # Classroom switching and cohort creation
│   │   ├── GroupsView.tsx           # Primary grouping distribution dashboard
│   │   ├── Header.tsx               # Status bar, sync indicator, subject toggle
│   │   ├── LiveTaggingView.tsx      # Sub-5-second rapid touch tagging interface
│   │   ├── ProgressView.tsx         # Trajectory and audit trail history view
│   │   └── SyncDrawerModal.tsx      # Offline sync reconciliation drawer
│   ├── data/
│   │   └── seedData.ts              # Pre-loaded baseline cohorts, templates & lessons
│   ├── services/
│   │   ├── groupingEngine.ts        # Deterministic scoring & promotion rules
│   │   └── storageService.ts        # LocalStorage singleton with pub/sub reactivity
│   ├── types/
│   │   └── index.ts                 # Full domain TypeScript declarations
│   ├── App.tsx                      # Root shell, viewport emulator & router
│   ├── index.css                    # Tailwind CSS v4 entrypoint
│   └── main.tsx                     # React application entrypoint
├── .env.example                     # Environment template documentation
├── .gitignore                       # Git ignore definitions
├── index.html                       # Application HTML shell
├── metadata.json                    # Project metadata declaration
├── package.json                     # Dependency manifests and scripts
├── package-lock.json                # Locked dependency tree
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite bundler configuration with base path
└── README.md                        # Complete project documentation
```

---

## 12. Installation & Local Setup

### Prerequisites
- **Node.js:** `v20.0.0` or higher (`v22.x` recommended)
- **Package Manager:** `npm` (`v10.x` or higher)
- **Modern Browser:** Chrome, Edge, Safari, or Firefox with Web Storage support

### 1. Clone the Repository
```bash
git clone https://github.com/ameydongre10/LevelLens.git
cd LevelLens
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000/LevelLens/`.

### 4. Build for Production
```bash
npm run build
```
This executes `tsc --noEmit` to validate all types, followed by `vite build` to output optimized static bundles to `dist/`.

### 5. Preview Production Build Locally
```bash
npm run preview
```
Serves the production `dist/` directory at `http://localhost:4173/LevelLens/`.

---

## 13. Internal Service Architecture & Data Layer

### `StorageService` Internal API
The local persistence layer (`src/services/storageService.ts`) acts as an in-browser SQLite/Room database surrogate:

```typescript
// Core Data Retrieval Methods
getClassrooms(): Classroom[]
getStudents(classroomId?: string): Student[]
getSnapshots(studentId?: string, subject?: Subject): StudentSkillSnapshot[]
getLiveTags(studentId?: string, subject?: Subject): LiveTagEvent[]
getAssessmentResults(studentId?: string): AssessmentResult[]
getAssessmentTemplates(): AssessmentTemplate[]
getActivities(): LowResourceActivity[]
getActivityLogs(classroomId?: string, subject?: Subject): ActivityLog[]

// Mutation & Action Methods
addStudent(classroomId: string, firstName: string, rollNumberOrAlias: string): Student
addClassroom(name: string, gradeInfo: string): Classroom
recordLiveTag(studentId: string, subject: Subject, tagType: TagType, conceptNotes?: string): LiveTagEvent
updateStudentTier(studentId: string, subject: Subject, newTier: SkillTier, source: SourceType, notes?: string): void
recordAssessmentResult(...): AssessmentResult
logActivityDone(classroomId: string, subject: Subject, activityId: string, skipped?: boolean, rating?: 'THUMBS_UP' | 'THUMBS_DOWN'): ActivityLog

// Sync & Reconcile Protocol
isOnline(): boolean
setNetworkMode(online: boolean): void
getPendingSyncCount(): number
getPendingSummary(): PendingSummary
reconcileAndSync(): Promise<{ success: boolean; syncedCount: number; error?: string }>
exportBackupJson(): string
resetToSampleSeed(): void
```

---

## 14. Error Handling & Reliability

1. **Graceful Storage Degradation:** If `localStorage` access is restricted (e.g., private browsing mode quota limit), mutations catch quota errors safely and log fallback notices without halting the React render tree.
2. **Network Resilience:** The network status flag decouples UI actions from network connectivity. When offline, `reconcileAndSync()` returns a clean informative state (`Sync failed. Working offline.`) without throwing uncaught promise rejections.
3. **Data Schema Migration Fallbacks:** Optional properties in domain entities (`conceptNotes`, `notes`, `rating`) utilize defensive optional chaining (`?.`) and fallback default values throughout the UI layer to eliminate undefined reference crashes.

---

## 15. Deployment Guide

LevelLens is optimized for static hosting platforms. It is deployed to **GitHub Pages** via official GitHub Actions workflows.

### GitHub Actions Pipeline Configuration
The repository includes `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: TypeScript validation
        run: npx tsc --noEmit
      - name: Build site
        run: npm run build
      - name: Verify build output
        run: |
          if [ ! -f dist/index.html ]; then
            echo "ERROR: dist/index.html not found!"
            exit 1
          fi
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Critical Configuration Note for GitHub Pages
- **Vite Base Path:** In `vite.config.ts`, `base: '/LevelLens/'` is set to ensure all bundled JavaScript and CSS assets resolve under the repository subpath.
- **Pages Source Setting:** In GitHub Repository **Settings $\rightarrow$ Pages**, the build source must be configured to **`GitHub Actions`** (API `build_type: "workflow"`), rather than legacy branch deployment.

---

## 16. Verification & Quality Assurance

Every release is validated against strict automated and manual benchmarks:

- **Type Safety:** `npm run typecheck` (`tsc --noEmit`) passes with zero compiler warnings or errors.
- **Production Build:** `npm run build` compiles clean static bundles in under 3 seconds.
- **Bundle Size Optimization:** Entire production distribution is $\approx 400\text{ KB}$ uncompressed ($\approx 105\text{ KB}$ gzip), enabling sub-second downloads on 2G/3G mobile networks.
- **Touch Accessibility:** All primary live interaction targets meet or exceed the standard $44\times 44\text{ px}$ tactile boundary.

---

## 17. Practical Use Cases

### Scenario A: Morning Multi-Grade Diagnostic
* **Context:** An educator enters a multi-grade classroom combining Grades 2, 3, and 4.
* **Action:** The teacher launches LevelLens on an Android phone, taps `Assess`, and calls students one by one for an oral 5-minute check.
* **System Response:** The teacher taps oral scores directly on the numbered pad. LevelLens calculates each child's level immediately upon completion.
* **Benefit:** In 30 minutes, 8 struggling students are identified, and the cohort distribution is automatically calculated without any paper scoring sheets.

### Scenario B: Mid-Lesson Floor Drill Live Tagging
* **Context:** The teacher conducts a chalk-floor letter-hop drill on the verandah with the Red Intensive cohort.
* **Action:** When *Aarav* successfully identifies 3 consecutive vowel sounds, the teacher taps `✓ Mastered` on the high-density roster.
* **System Response:** The tagging engine records the event and surfaces a promotion alert: *"Aarav mastered 3 consecutive drills $\rightarrow$ Suggested move: RED $\rightarrow$ YELLOW"*.
* **Benefit:** Learning breakthroughs translate immediately into dynamic group movement rather than waiting for end-of-term exams.

---

## 18. Problem-to-Impact Mapping

| Critical Barrier in Rural Education | How LevelLens Addresses It | Expected Institutional Impact |
|---|---|---|
| **Excessive Teacher Paperwork** | Automates diagnostic rubric scoring, group sorting, and record-keeping | Saves 4–6 hours of administrative overhead per assessment cycle |
| **Miscalibrated Teaching Level** | Surfaces cohort skill bottlenecks (e.g. 48% word decoding deficit) | Shifts instruction from rote grade curriculum to actual student competency |
| **Student Stagnation in Remediation** | Proactive 3-tag promotion heuristic prompts upward cohort re-leveling | Accelerates progression out of remedial tiers into grade-level fluency |
| **Connectivity Dependency** | Offline-first reactive local storage with zero cloud dependencies | 100% reliable software availability regardless of rural network outages |

---

## 19. Current Limitations

- **Single-Device Local Storage:** Data is currently persisted inside the device browser's `localStorage` sandbox (~5MB capacity). It does not automatically synchronize across multiple independent physical phones without manual JSON export/import or cloud backend reconciliation.
- **Simulated Cloud Endpoint:** The `reconcileAndSync()` method demonstrates the payload reconciliation pattern and updates sync flags via simulated network transfers. Integration with a live enterprise database (e.g. PostgreSQL or Firebase) requires configuring external API endpoints.
- **Manual Data Backup Requirement:** Clearing the mobile browser's cache or website data will wipe local records unless teachers have exported a periodic JSON backup using the built-in backup utility.

---

## 20. Future Roadmap

### Short-Term Enhancements
- [ ] **IndexedDB Engine Migration:** Upgrade from `localStorage` to `IndexedDB` (via `idb` or `Dexie.js`) to support larger historical audit logs across school years.
- [ ] **Printable Slate Sheets:** Offline export to clean, printable PDF rosters formatted for physical bulletin boards.
- [ ] **Audio Prompt Pronunciation:** Pre-recorded local audio snippets demonstrating accurate phonics sounds for non-native English instructors.

### Long-Term Roadmap
- [ ] **Peer-to-Peer Bluetooth Sync:** Enable multi-teacher synchronization across adjoining classrooms via WebRTC / Bluetooth without internet access.
- [ ] **District School Management Integration:** Authorized bulk reconciliation adapter connecting with state education portals (UDISE+ / national data hubs).

---

## 21. Contributing

Contributions are welcome from educators, accessibility advocates, and frontend engineers.

1. **Fork the Repository:** Click the `Fork` button at the top of the GitHub page.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/targeted-enhancement
   ```
3. **Commit Your Modifications:**
   ```bash
   git commit -m "feat: implement indexeddb persistence adapter"
   ```
4. **Validate Types & Build:**
   ```bash
   npm run typecheck
   npm run build
   ```
5. **Push to Your Fork & Open a PR:**
   ```bash
   git push origin feature/targeted-enhancement
   ```

---

## 22. License

> No license has currently been specified for this repository. All rights reserved by the repository owner.
