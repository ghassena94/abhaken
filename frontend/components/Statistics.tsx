import { Component, template, style } from "uix/components/Component.ts";

@style("./Statistics.css")
@template(() => (
  <div class="statistics-container">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">Tasks Completed</div>
          <div class="stat-icon icon-blue">
            <i class="fas fa-tasks"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">24</div>
          <div class="stat-change icon-blue">
            <span class="arrow">↓</span> 32%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">Tasks In Progress</div>
          <div class="stat-icon icon-red">
            <i class="far fa-clock"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">16</div>
          <div class="stat-change icon-red">
            <span class="arrow">↑</span> 12%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">Team Efficiency</div>
          <div class="stat-icon icon-green">
            <i class="fas fa-running"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">87%</div>
          <div class="stat-change icon-green">
            <span class="arrow">↓</span> 8%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">Upcoming Deadlines</div>
          <div class="stat-icon icon-orange">
            <i class="fa fa-calendar"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">8</div>
          <div class="stat-change icon-orange">
            <span class="arrow">↑</span> 2
          </div>
        </div>
      </div>
    </div>
  </div>
))
export class Statistics extends Component {}
