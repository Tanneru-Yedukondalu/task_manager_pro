import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true, // Enables listening on all addresses, including the LAN IP
    port: 5173,
    https: {
      key: fs.readFileSync("/home/mv/Desktop/Task_Manager_Pro/key.pem"),
      cert: fs.readFileSync("/home/mv/Desktop/Task_Manager_Pro/cert.pem"),
    },
  }
})
