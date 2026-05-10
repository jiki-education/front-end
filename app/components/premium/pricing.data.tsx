import Link from "next/link";
import type { FaqItem, FeatureCategoryData } from "./pricing.types";

export const FEATURE_CATEGORIES: FeatureCategoryData[] = [
  {
    label: "Coding Fundamentals",
    features: [
      {
        title: "Coding Exercises",
        desc: "Learn by doing with our growing library of interactive exercises.",
        free: true,
        premium: true
      },
      {
        title: "Full Concept Library",
        desc: "Bite-sized lessons covering every coding concept you need to know.",
        free: true,
        premium: true
      },
      {
        title: "Jiki Projects",
        desc: "Combine the skills you've learned into real, end-to-end projects.",
        free: false,
        premium: true
      },
      {
        title: "Talk to Jiki",
        desc: "Get unstuck with AI-powered hints and explanations from Jiki.",
        free: "30 mins",
        premium: "Unlimited"
      }
    ]
  },
  {
    label: "Build with Jeremy",
    features: [
      {
        title: "Building Fundamentals series",
        desc: "Watch Jeremy build a web platform from scratch — servers, databases, auth, and more.",
        free: "First episodes",
        premium: "Full access"
      },
      {
        title: "How Things Work series",
        desc: "Deep dives into the trickier bits of Exercism and Jiki, and why they're built that way.",
        free: "Sample Episode",
        premium: "Full access"
      },
      {
        title: "Early access to new features",
        desc: "Try out new features before everyone else.",
        free: false,
        premium: true
      }
    ]
  },
  {
    label: "Support",
    features: [
      {
        title: "Community forums",
        desc: "Ask questions and learn alongside other Jiki students.",
        free: true,
        premium: true
      },
      {
        title: "Q&A livestreams with Jeremy",
        desc: "Join live Q&A sessions where Jeremy answers your coding and building questions.",
        free: false,
        premium: true
      }
    ]
  },
  {
    label: "Certificates",
    features: [
      {
        title: "Earn certificates for courses",
        desc: "Show off what you've learned with shareable certificates.",
        free: false,
        premium: true
      }
    ]
  },
  {
    label: "Experience",
    features: [
      {
        title: "Ad-free learning",
        desc: "Focus on learning without distractions.",
        free: false,
        premium: true
      }
    ]
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Can I try Jiki for free?",
    answer:
      "Yes! You can sign up for free and use the Basic plan for as long as you like. Upgrade to Premium whenever you need full access — there's no obligation."
  },
  {
    question: "Is there a minimum contract length?",
    answer: "No minimum contract — Premium is billed monthly and you can cancel at any time from your account settings."
  },
  {
    question: "What happens if I cancel my Premium subscription?",
    answer:
      "You'll keep Premium access until the end of your current billing period, and then your account will move back to the Basic plan. You don't lose any of your progress — you just lose access to Premium-only features."
  },
  {
    question: "Do you offer discounts for students or those who can't afford Premium?",
    answer: (
      <>
        We want Jiki to be accessible to everyone. If cost is a barrier, please{" "}
        <Link href="/articles/support">get in touch</Link> and we&apos;ll do what we can to help.
      </>
    )
  },
  {
    question: "Can I upgrade or downgrade later?",
    answer:
      "Absolutely. You can upgrade to Premium at any time from your account, and you can cancel just as easily whenever you'd like."
  }
];
