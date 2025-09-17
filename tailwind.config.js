/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Panda-inspired dark theme
        'panda-bg': '#0A0A0A',        // Very dark background
        'panda-surface': '#111111',    // Dark surface
        'panda-card': '#1A1A1A',       // Card background
        'panda-border': '#2A2A2A',     // Border color
        'panda-text': '#E5E5E5',       // Primary text
        'panda-text-muted': '#A0A0A0', // Muted text
        'panda-accent': '#00FF88',     // Light green accent (panda bamboo)
        'panda-accent-dark': '#00CC6A', // Darker green
        'panda-accent-light': '#33FF99', // Lighter green
        'panda-success': '#00FF88',    // Success green
        'panda-warning': '#FFB800',    // Warning amber
        'panda-error': '#FF4444',      // Error red
        'panda-info': '#00BFFF',       // Info blue
        
        // Legacy colors for compatibility
        'rs-gold': '#FFD700',
        'rs-blue': '#1E3A8A',
        'rs-dark': '#1F2937',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
