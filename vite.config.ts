import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";

function gitLastModified(filePath: string): string {
  try {
    const iso = execSync(`git log -1 --format="%aI" -- ${filePath}`, {
      encoding: "utf-8",
    }).trim();
    if (!iso) throw new Error("no commits");
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis",
    __PRIVACY_LAST_UPDATED__: JSON.stringify(
      gitLastModified("src/pages/Privacy.tsx")
    ),
    __TERMS_LAST_UPDATED__: JSON.stringify(
      gitLastModified("src/pages/Terms.tsx")
    ),
  },
  server: {
    fs: {
      allow: ["/Users/jatin/Desktop/Unsent/unsent-ui"],
    },
  },
});
