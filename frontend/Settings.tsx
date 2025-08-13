import { Context } from "uix/routing/context.ts";
import { Component, template, style } from "uix/components/Component.ts";
import { Sidebar } from "./components/Sidebar.tsx";
import { ProfileSettings } from "./components/settings/ProfileSettings.tsx";
import { getProjects, getCurrentUser } from "backend/user-data.ts";
import { Project } from "common/types/projects.ts";

const activeSettingsTab = $<"profile" | "account" | "notifications">("profile");

// Definition der Tabs, direkt in dieser Datei
const settingsTabs = [
  { id: "profile", label: "Profile", icon: "fa fa-user", description: "Manage your personal information" },
  { id: "notifications", label: "Notifications", icon: "fa fa-bell", description: "Configure your notification preferences" },
  { id: "security", label: "Security", icon: "fa fa-shield-alt", description: "Password and security settings" },
  { id: "appearance", label: "Appearance", icon: "fa fa-palette", description: "Customize your interface" },
  { id: "preferences", label: "Preferences", icon: "fa fa-globe", description: "Language and regional settings" },
  { id: "billing", label: "Billing", icon: "fa fa-credit-card", description: "Manage your subscription" },
];

// Die kombinierte UI-Komponente für die Settings
@style("./components/settings/Settings.css") // Wir verwenden das existierende CSS weiter
@template(() => (
  <div class="settings-layout">
    <header class="settings-header">
      <div class="settings-header-content">
        <h1 class="settings-title">Settings</h1>
        <p class="settings-desc">Manage your account settings and preferences</p>
      </div>
    </header>
    <main class="settings-main">
      <div style="max-width: 800px; margin: 0 auto;">
        {/* Tabs werden hier gerendert */}
        <nav class="settings-tabs-grid">
          {settingsTabs.map(tab => (
            <button
              type="button"
              class={`settings-tab-card${activeSettingsTab.val === tab.id ? " active" : ""}`}
              onclick={() => activeSettingsTab.val = tab.id as any}
            >
              <div class="settings-tab-card-icon"><i class={tab.icon}></i></div>
              <div class="settings-tab-card-content">
                <h3 class="settings-tab-card-title">{tab.label}</h3>
                <p class="settings-tab-card-desc">{tab.description}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Inhalt basierend auf dem aktiven Tab */}
        <div style="margin-top: 2rem;">
          {activeSettingsTab.val === "profile" && <ProfileSettings />}
          {activeSettingsTab.val !== "profile" && <div>Content for '{activeSettingsTab.val}' coming soon...</div>}
        </div>

        {/* Zurück-Button, der zur Dashboard-Seite navigiert */}
        <button type="button" onclick={() => location.href = "/DashboardPage"} class="btn-back" style="margin-top:2rem;">
          <i class="fa fa-arrow-left"></i> Back
        </button>
      </div>
    </main>
  </div>
))
class SettingsContent extends Component {}

// Der Hauptexport für die Route /settings
export default async (ctx: Context) => {
  const user = await getCurrentUser();
  if (!user) {
    if (typeof window !== "undefined") globalThis.location.href = "/loginPage";
    return <div>Redirecting to login...</div>;
  }

  const projects = $<Project[]>(await getProjects());

  return (
    <div class="page-layout">
      <link rel="stylesheet" href="./global.css"></link>
      <Sidebar projects={projects} />
      <div class="main-container-with-sidebar">
        <SettingsContent />
      </div>
    </div>
  );
};