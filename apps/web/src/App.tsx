import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ContextualSidebar } from './layouts/ContextualSidebar';

import { OverviewView } from './features/overview/OverviewView';
import { ProjectsView } from './features/projects/ProjectsView';
import { VulnerabilitiesView } from './features/vulnerabilities/VulnerabilitiesView';
import { SbomView } from './features/sbom/SbomView';
import { VexView } from './features/vex/VexView';
import { EvidenceView } from './features/evidence/EvidenceView';
import { CraReadinessView } from './features/compliance/CraReadinessView';
import { IntegrationsView } from './features/integrations/IntegrationsView';
import { DocsView } from './features/docs/DocsView';
import { SettingsView } from './features/settings/SettingsView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              title="Overview"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Overview' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <OverviewView />
            </AppLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <AppLayout
              title="Projects"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Projects' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <ProjectsView />
            </AppLayout>
          }
        />
        <Route
          path="/vulnerabilities"
          element={
            <AppLayout
              title="Vulnerabilities"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Vulnerabilities' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <VulnerabilitiesView />
            </AppLayout>
          }
        />
        <Route
          path="/sbom"
          element={
            <AppLayout
              title="SBOM Inventory"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'SBOM Inventory' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <SbomView />
            </AppLayout>
          }
        />
        <Route
          path="/vex"
          element={
            <AppLayout
              title="VEX Statements"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'VEX Statements' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <VexView />
            </AppLayout>
          }
        />
        <Route
          path="/evidence"
          element={
            <AppLayout
              title="Evidence Center"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Evidence Center' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <EvidenceView />
            </AppLayout>
          }
        />
        <Route
          path="/cra-readiness"
          element={
            <AppLayout
              title="CRA Readiness"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'CRA Readiness' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <CraReadinessView />
            </AppLayout>
          }
        />
        <Route
          path="/integrations"
          element={
            <AppLayout
              title="Integrations"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Integrations' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <IntegrationsView />
            </AppLayout>
          }
        />
        <Route
          path="/docs"
          element={
            <AppLayout
              title="Documentation"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Documentation' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <DocsView />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout
              title="Settings"
              breadcrumbs={[{ label: 'Acme DevSec Corp' }, { label: 'Settings' }]}
              contextualSidebar={<ContextualSidebar />}
            >
              <SettingsView />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
