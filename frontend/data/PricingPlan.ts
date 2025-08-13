import { plans_data_type } from "frontend/types.tsx"

const plans_data: plans_data_type[] = $([
  {
    title: "Starter",
    price: "0",
    per: "month",
    content: "Perfect for individuals and small teams just getting started.",
    features: [
      "Up to 5 team members",
      "Unlimited taske",
      "Basic board views",
      "2 projects",
      "Email support"
    ],
    selected: false,
    button: "Get started",
  },
  {
    title: "Pro",
    price: "12",
    per: "month per user",
    content: "Everything in Starter, plus advanced features for growing teams.",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced board views",
      "Priority support",
      "All integrations",
    ],
    selected: true,
    button: "Get started",
  },
  {
    title: "Enterprise",
    price: "Custom",
    per: "",
    content: "Advanced features, 24/7 support, and enterprise-grade security.",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantees"
    ],
    selected: false,
    button: "Get started",
  }
])

export default plans_data;