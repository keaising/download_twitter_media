import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monkey, { cdn, util } from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        namespace: "download_twitter_media",
        match: ["https://twitter.com/*", "https://x.com/*"],
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr("React", "umd/react.production.min.js"),
          "react-dom": cdn.jsdelivr(
            "ReactDOM",
            "umd/react-dom.production.min.js",
          ),
          // "file-saver": cdn.jsdelivr("FileSaver", "dist/FileSaver.min.js"),
          // jszip: cdn.jsdelivr("JSZip", "dist/jszip.min.js"),
        },
      },
    }),
  ],
});
