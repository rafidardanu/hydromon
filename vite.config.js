import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ['mqtt', 'react-gauge-chart']
//   }
// });