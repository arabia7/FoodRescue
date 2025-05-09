import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", 
    port: 8080,
    fs: {
      
      allow: ['..']
    }
  },
  plugins: [
    react({
      
      fastRefresh: true
    }),
    
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ],
    
    exclude: ['firebase/analytics']
  },
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          
        }
      }
    }
  }
}));