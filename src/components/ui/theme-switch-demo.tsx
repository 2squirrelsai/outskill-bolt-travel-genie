import ThemeSwitch from "@/components/ui/theme-switch";

export default function ThemeSwitchDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Theme Switch Demo
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300">Light</span>
          <ThemeSwitch />
          <span className="text-gray-700 dark:text-gray-300">Dark</span>
        </div>
      </div>
    </div>
  );
}

export { ThemeSwitchDemo as DemoOne };