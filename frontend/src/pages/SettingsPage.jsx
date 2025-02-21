import React from "react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../lib/constant.js";

const SettingsPage = () => {
  const { theme: currentTheme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-3xl">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-base-content/70">
          Choose a theme for your chat interface
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {THEMES?.map((theme) => (
          <button
            key={theme}
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
              theme === currentTheme ? "bg-base-200" : "hover:bg-base-200/50"
            }`}
            onClick={() => {
              setTheme(theme);
            }}
          >
            <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={theme}>
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary"></div>
                <div className="rounded bg-secondary"></div>
                <div className="rounded bg-accent"></div>
                <div className="rounded bg-neutral"></div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {theme.charAt(0).toUpperCase() + theme.slice(1)} 
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
