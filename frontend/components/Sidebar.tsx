import { Component, template, style } from "uix/components/Component.ts";
import { Project } from "common/types/projects.ts";
import { logout } from "backend/user-data.ts";
import { getCurrentUser } from "backend/user-data.ts";

const sidebarExpanded = $(window.innerWidth > 800);
const wasManuallyToggled = $(false);

// User info for sidebar
const currentUser = await getCurrentUser();
const userDisplayName = currentUser?.username || "User";
const userInitials = userDisplayName
  .split(" ")
  .map((word: string) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

@style("./Sidebar.css")
@template((props) => (
  <div class={`sidebar ${sidebarExpanded.val ? "expanded" : "collapsed"}`}>
    <div class="sidebar-header">
      <div class="icon-wrapper">
        <i class="fa fa-check"></i>
      </div>
      <span class="title">abhaken</span>
      <button
        type="button"
        class="toggle-button"
        onclick={() => {
          sidebarExpanded.val = !sidebarExpanded.val;
          wasManuallyToggled.val = window.innerWidth <= 800;
        }}
      >
        <i
          class={`fas ${
            sidebarExpanded.val ? "fa-angle-left" : "fa-angle-right"
          }`}
        ></i>
      </button>
    </div>

    <div class="nav-scrollable">
      <div class="nav-section">
        <div class="nav-category">Main</div>

        <div
          class="nav-button"
          data-title="Dashboard"
          title="Dashboard"
          onclick={() => location.href = "/DashboardPage"}
        >
          <i class="fa fa-home"></i>
          <span>Dashboard</span>
        </div>

        <div class="nav-button" data-title="Calendar" title="Calenda">
          <i class="fa fa-calendar"></i>
          <span>Calendar</span>
        </div>

        <div class="nav-button" data-title="Analytics" title="Analytics">
          <i class="fa fa-chart-bar"></i>
          <span>Analytics</span>
        </div>
      </div>

      <div class="nav-scrollable">
        <div class="nav-section">
          <div class="nav-category">Projects</div>
          <div class="projects-scrollable">
            {props.projects.map((project) => (
              <div
                class="nav-project"
                data-title={project.title}
                title={project.title}
              >
                <span class={`dot purple`}></span>
                <span>{project.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div class="nav-section settings-section">
        <div class="nav-category">Admin</div>

        <div
          class="nav-button"
          data-title="Settings"
          title="Settings"
          onclick={() => location.href = "/settings"}
        >
          <i class="fa fa-cog"></i>
          <span>Settings</span>
        </div>
      </div>

      <div class="nav-section user-section">
        <div class="nav-category">User</div>

        <div class="nav-team-member" data-title={userDisplayName} title={userDisplayName}>
          <span class="avatar">{userInitials}</span>
          <span>{userDisplayName}</span>
        </div>

        <div class="logout-button" data-title="Logout" title="Logout">
          <form
            action={logout}
            method="post"
            class="logout-form"
            onsubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch("/logout", {
                  method: "POST",
                });
                if (response.redirected) {
                  window.location.href = response.url;
                } else {
                  window.location.reload();
                }
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
          >
            <button type="submit" class="logout-button-button">
              <i class="fa fa-sign-out"></i>
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
))
export class Sidebar extends Component<{ projects: Project[] }> {
  #resizeObserver?: ResizeObserver;
  #lastWindowWidth = window.innerWidth;

  override onCreate() {
    sidebarExpanded.val = window.innerWidth > 800;

    this.#resizeObserver = new ResizeObserver(() => {
      const currentWidth = window.innerWidth;

      if (currentWidth <= 800 && this.#lastWindowWidth > 800) {
        sidebarExpanded.val = false;
        wasManuallyToggled.val = false;
      } else if (currentWidth > 800 && this.#lastWindowWidth <= 800) {
        sidebarExpanded.val = true;
        wasManuallyToggled.val = false;
      }

      this.#lastWindowWidth = currentWidth;
    });

    this.#resizeObserver.observe(document.body);
  }

  override remove() {
    this.#resizeObserver?.disconnect();
  }
}
