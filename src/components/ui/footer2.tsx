interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop&crop=center",
    alt: "TravelThread Logo",
    title: "TravelThread",
    url: "/",
  },
  tagline = "Plan amazing trips with AI-powered recommendations.",
  menuItems = [
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
  copyright = "© 2024 TravelThread. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#terms" },
    { text: "Privacy Policy", url: "#privacy" },
  ],
}: Footer2Props) => {
  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a href={logo.url} className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">✈️</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{logo.title}</p>
                </a>
              </div>
              <p className="mt-4 font-bold text-gray-600 dark:text-gray-300">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-gray-900 dark:text-white">{section.title}</h3>
                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-8 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };