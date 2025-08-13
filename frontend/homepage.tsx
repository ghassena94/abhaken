/**
 * Homepage:
 * Shown before and after login
 */
import { type Entrypoint } from "uix/providers/entrypoints.ts";
import FeatureCard from "./components/FeatureCard.tsx";
import plans_data from "frontend/data/PricingPlan.ts";
import PricingCard from "./components/PricingCard.tsx";
import { TestimonialGallery } from "frontend/components/TestimonialGallery.tsx";
import { features } from "frontend/data/Features.ts";
import { sectionLinks } from "frontend/data/SectionLinks.ts";
import { provideRedirect } from "uix/providers/common.tsx";

let lastScrollTop = 0;
const delta = 5;
const navbarHeight = 80;

export default (() => {
  const navBarMenuOpen = $(false);
  const lastSelected = $(1);
  const navbarClass = $<string>("nav-down");
  const activeSection = $("home");

  effect(() => {
    let didScroll = false;

    const onScroll = () => {
      didScroll = true;
    };

    const _interval = setInterval(() => {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    globalThis.addEventListener("scroll", onScroll);
  });

  function hasScrolled() {
    const st = globalThis.scrollY;

    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop && st > navbarHeight) {
      navbarClass.val = "nav-up";
    } else {
      if (st + globalThis.innerHeight < document.body.scrollHeight) {
        navbarClass.val = "nav-down";
      }
    }

    lastScrollTop = st;
  }

  function setSelected(index: number) {
    plans_data[lastSelected].selected = false;
    plans_data[index].selected = true;
    lastSelected.val = index;
  }

  effect(() => {
    const elements = document.querySelectorAll(".animate-fade-in-up");
    elements.forEach((el) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("animate-fade-in-up");
            observer.unobserve(el);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    });
  });

  effect(() => {
    if (navBarMenuOpen.val) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  return (
    <>
      <head>
        <link rel="stylesheet" href="./homepage.css"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body class="page">
        <header class={`header ${navbarClass.val}`}>
          <nav class="nav-container">
            <img
              class="logo"
              src="frontend/images/logo/logo_primary_transparent_white.png"
              alt="Abhaken Logo"
            />
            <div id="navbarLinks" class="navbar-links">
              {sectionLinks.map((link) => (
                <a
                  id={link.href}
                  href={link.href}
                  class="nav-link"
                  onclick={() =>
                    document
                      .getElementById(link.label.toLowerCase())
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div class="auth-container">
              <div class="auth-buttons">
                <a class="login-button" onclick={() => window.location.href = '/loginPage'}>Log In</a>
                <button
                  type="button"
                  class="btn-primary"
                  onclick={() => window.location.href = '/loginPage'}>
                  Sign Up Free
                </button>
              </div>
              <img
                class="mobile-menu-button"
                role="button"
                onclick={() => (navBarMenuOpen.val = !navBarMenuOpen.val)}
                src={
                  navBarMenuOpen.val === true
                    ? "frontend/images/homepage/close-outline.svg"
                    : "frontend/images/homepage/menu-outline.svg"
                }
                alt="MENU"
                tabindex={`${navBarMenuOpen ? "0" : "-1"}`}
                onkeydown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement)?.click();
                  }
                }}
              />
            </div>
          </nav>

          {navBarMenuOpen.val && (
            <div
              class="mobile-menu-overlay"
              onclick={() => (navBarMenuOpen.val = false)}
              aria-label="Menü schließen"
            />
          )}
          <div
            id="navbarBurgerMenu"
            class={`mobile-menu ${navBarMenuOpen.val ? "open" : ""}`}
          >
            <nav class="mobile-menu-nav">
              {sectionLinks.map((link) => (
                <a
                  id={link.href}
                  href={link.href}
                  onclick={() => {
                    document
                      .getElementById(link.label.toLowerCase())
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                    navBarMenuOpen.val = false;
                  }}
                  class={`mobile-menu-link ${
                    activeSection.val === link.href.replace("#", "")
                      ? "active"
                      : ""
                  }`}
                  tabindex={navBarMenuOpen ? "0" : "-1"}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div class="mobile-menu-auth">
              <a class="mobile-login-button" onclick={() => window.location.href = '/loginPage'}>Log In</a>
              <button type="button" class="btn-primary" onclick={() => window.location.href = '/loginPage'}>
                Sign Up
              </button>
            </div>
          </div>
        </header>

        <section id="heroSection" class="hero-section">
          <div class="container">
            <div class="hero-content animate-fade-in-up">
              <span class="badge">New: Mobile App Now Available</span>
              <h1>
                Task management <br /> made simple
              </h1>
              <p class="hero-description">
                Abhaken helps teams organize, track, and manage their work with
                beautiful clarity. Boost productivity and never miss a deadline
                again.
              </p>
              <div class="hero-cta">
                <button type="button" class="btn-primary" onclick={() => window.location.href = '/loginPage'}>
                  Get started for free
                </button>
                <button type="button" class="btn-outline">
                  <span class="flex items-center">
                    <svg class="play-icon" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                      />
                      <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
                    </svg>
                    Watch demo
                  </span>
                </button>
              </div>
              <div id="trustedBySectionLg" class="trusted-by">
                <p>Trusted by teams at</p>
                <div class="trusted-by-logos">
                  <span>TU Berlin</span>
                  <span>TU Berlin</span>
                  <span>TU Berlin</span>
                </div>
              </div>
            </div>
            <div class="hero-image delay-200">
              <img
                src="frontend/images/homepage/hero-image.png"
                alt="App screenshot"
                class="animate-fade-in-up"
              />
            </div>
            <div id="TrustedBySectionSm" class="trusted-by mobile">
              <p>Trusted by teams at</p>
              <div class="trusted-by-logos">
                <span>TU Berlin</span>
                <span>TU Berlin</span>
                <span>TU Berlin</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" class="feature-section">
          <h2>
            Everything you need <br /> to manage tasks effectively
          </h2>
          <h3>
            Abhaken combines powerful features with beautiful simplicity to help
            your team stay organized and productive.
          </h3>
          <div class="feature-grid">
            <FeatureCard featuresdata={features[0]} />
            <FeatureCard featuresdata={features[1]} />
            <FeatureCard featuresdata={features[2]} />
            <FeatureCard featuresdata={features[3]} />
            <FeatureCard featuresdata={features[4]} />
            <FeatureCard featuresdata={features[5]} />
          </div>
        </section>

        <section id="workflow" class="workflow-section">
          <h2>Streamline your workflow</h2>
          <p>
            See how Abhaken transforms the way your team works with powerful yet
            intuitive tools.
          </p>
          <div class="workflow-container">
            <div class="workflow-item animate-fade-in-up">
              <div class="workflow-number">1</div>
              <h3>Create and organize tasks</h3>
              <p>
                Quickly add tasks, set priorities, and organize them into
                projects. Use drag-and-drop to rearrange tasks and create the
                perfect workflow for your team.
              </p>
              <ul>
                <li>
                  <span class="check-icon"></span>Intuitive task creation
                </li>
                <li>
                  <span class="check-icon"></span>Custom task categories
                </li>
                <li>
                  <span class="check-icon"></span>Priority levels and deadlines
                </li>
              </ul>
            </div>
            <div class="workflow-image">
              <img
                src="frontend/images/homepage/workflow_create_task.png"
                alt="Kanban board visualization"
                class="animate-fade-in-up"
              />
            </div>
            <div class="workflow-image">
              <img
                src="frontend/images/homepage/workflow_kanban_board.png"
                alt="Kanban board visualization"
                class="animate-fade-in-up"
              />
            </div>
            <div class="workflow-item animate-fade-in-up delay-300">
              <div class="workflow-number">2</div>
              <h3>Visualize your workflow</h3>
              <p>
                See your tasks in multiple views - Kanban boards, lists, or
                calendars. Track progress at a glance and identify bottlenecks
                before they become problems.
              </p>
              <ul>
                <li>
                  <span class="check-icon"></span>Flexible board views
                </li>
                <li>
                  <span class="check-icon"></span>Drag-and-drop interface
                </li>
                <li>
                  <span class="check-icon"></span>Real-time status updates
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials" class="testimonials-section">
          <h2>Loved by teams worldwide</h2>
          <h3>
            See what our customers have to say about how Abhaken has elevated
            their productivity.
          </h3>
          <TestimonialGallery />
        </section>

        <section id="pricing" class="pricing-section">
          <h2>Simple, transparent pricing</h2>
          <h3>
            No hidden fees, no surprises. Choose the plan that works best for
            your team.
          </h3>
          <div class="pricing-cards">
            <PricingCard
              plan={plans_data[0]}
              onmouseover={() => setSelected(0)}
            />
            <PricingCard
              plan={plans_data[1]}
              onmouseover={() => setSelected(1)}
            />
            <PricingCard
              plan={plans_data[2]}
              onmouseover={() => setSelected(2)}
            />
          </div>
        </section>

        <footer>
          <section id="ctaSection" class="cta-section">
            <div class="cta-content">
              <h1>Ready to boost your team's productivity?</h1>
              <h4>
                Join thousands of teams who use Abhaken to organize their work
                and achieve more together
              </h4>
              <div class="cta-buttons">
                <button type="button" class="btn-white">
                  Get started for free
                </button>
                <button type="button" class="btn-outline-white">
                  Schedule a demo
                </button>
              </div>
            </div>
          </section>
          <div class="footer">
            <img
              src="frontend/images/logo/logo_primary_transparent_white.png"
              alt="Abhaken(logo)"
              class="footer-logo"
            />
            <div class="footer-links">
              <div class="footer-column">
                <h3>Product</h3>
                <a
                  onclick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Features
                </a>
                <a
                  onclick={() =>
                    document
                      .getElementById("workflow")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Workflow
                </a>
                <a
                  onclick={() =>
                    document
                      .getElementById("testimonials")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Testimonials
                </a>
                <a
                  onclick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Pricing
                </a>
              </div>
              <div class="footer-column">
                <h3>Resources</h3>
                <a>Blog</a>
                <a>Help-Center</a>
              </div>
              <div class="footer-column">
                <h3>Company</h3>
                <a>About</a>
              </div>
              <div class="footer-column">
                <h3>Legal</h3>
                <a>Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </>
  );
}) satisfies Entrypoint;
