import { Footer2 } from "@/components/ui/footer2";

const demoData = {
  logo: {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop&crop=center",
    alt: "TravelGenie Logo",
    title: "TravelGenie",
    url: "/",
  },
  tagline: "Plan amazing trips with AI-powered recommendations.",
  menuItems: [
    {
      title: "Product",
      links: [
        { text: "Features", url: "#features" },
        { text: "Pricing", url: "#pricing" },
        { text: "AI Assistant", url: "#ai-assistant" },
        { text: "Trip Planning", url: "#trip-planning" },
        { text: "Budget Tracking", url: "#budget-tracking" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#about" },
        { text: "Blog", url: "#blog" },
        { text: "Careers", url: "#careers" },
        { text: "Contact", url: "#contact" },
        { text: "Privacy", url: "#privacy" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help Center", url: "#help" },
        { text: "Travel Guides", url: "#guides" },
        { text: "API Documentation", url: "#api" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "https://twitter.com" },
        { text: "Instagram", url: "https://instagram.com" },
        { text: "LinkedIn", url: "https://linkedin.com" },
      ],
    },
  ],
  copyright: "© 2024 TravelGenie. All rights reserved.",
  bottomLinks: [
    { text: "Terms and Conditions", url: "#terms" },
    { text: "Privacy Policy", url: "#privacy" },
  ],
};

function Footer2Demo() {
  return <Footer2 {...demoData} />;
}

export { Footer2Demo };