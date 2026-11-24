import { defineConfig } from "vite";

// Relative base so the built site works under a GitHub Pages project path
// (https://reason195.github.io/listingsmith/) as well as at a domain root.
export default defineConfig({
  base: "./",
});
