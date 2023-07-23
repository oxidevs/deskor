import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const getConfig = () => {
  const viteConfig = {
    plugins: [vue()],
  };

  if (process.env.NODE_ENV === "production")
    viteConfig.base = path.resolve(__dirname, "./dist/");
  else if (process.env.NODE_ENV === "github") viteConfig.base = "./";

  return viteConfig;
};

// https://vitejs.dev/config/
export default defineConfig(getConfig());
