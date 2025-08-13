import { Component, template, style } from "uix/components/Component.ts";

@style("./LatestActivities.css")
@template(() => {
  const activities = [
    {
      iconClass: "fa fa-calendar",
      title: "Task Completed",
      description: 'Anna completed "Design mobile app screens"',
      time: "2h ago",
      color: "blue",
    },
    {
      iconClass: "fa fa-pencil",
      title: "Comment Added",
      description: 'Thomas commented on "Draft email newsletter"',
      time: "4h ago",
      color: "red",
    },
    {
      iconClass: "fa fa-users",
      title: "New Team Member",
      description: "Sarah joined the Marketing Campaign project",
      time: "8h ago",
      color: "green",
    },
    {
      iconClass: "fa fa-warning",
      title: "Deadline Approaching",
      description: '"Implement task filtering" due in 2 days',
      time: "12h ago",
      color: "orange",
    },
  ];

  const notifications = [
    {
      message: "Du wurdest zum Projekt Webtechnologien eingeladen.",
      time: "1h ago",
      color: "purple",
    },
    {
      message: "Ein neuer Kommentar wurde deinem Task hinzugefügt.",
      time: "3h ago",
      color: "purple",
    },
    {
      message: "Meeting mit dem Team wurde geplant für Freitag.",
      time: "6h ago",
      color: "purple",
    },
  ];

  return (
    <div class="dashboard-grid-container">
      <div class="card">
        <div class="card-header">
          <h3>Recent Activity</h3>
          <a href="#" class="view-all">
            View All
          </a>
        </div>
        <div class="activity-list">
          {activities.map((activity) => (
            <div class="activity-item">
              <div class={`icon-wrapper ${activity.color}`}>
                <i class={activity.iconClass}></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{activity.title}</div>
                <div class="activity-description">{activity.description}</div>
              </div>
              <div class="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Notifications</h3>
          <a href="#" class="view-all">
            View All
          </a>
        </div>
        <div class="notification-list">
          {notifications.map((note) => (
            <div class="notification-item">
              <span class={`dot ${note.color}`}></span>
              <div class="notification-message">{note.message}</div>
              <div class="notification-time">{note.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
})
export class LatestActivities extends Component {}