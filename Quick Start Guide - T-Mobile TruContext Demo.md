# Quick Start Guide - T-Mobile TruContext Demo

## Installation & Running Locally

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Steps

1. **Extract the zip file**
   ```bash
   unzip tmobile-trucontext-demo-source.zip
   cd tmobile-trucontext-demo
   ```

2. **Install dependencies**
   
   Using pnpm (recommended):
   ```bash
   pnpm install
   ```
   
   Or using npm:
   ```bash
   npm install
   ```

3. **Run the development server**
   
   Using pnpm:
   ```bash
   pnpm run dev
   ```
   
   Or using npm:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   
   Navigate to: `http://localhost:5173`

### Build for Production

To create a production build:

```bash
pnpm run build
# or
npm run build
```

The built files will be in the `dist/` folder.

### Preview Production Build

To preview the production build locally:

```bash
pnpm run preview
# or
npm run preview
```

## Project Structure

```
tmobile-trucontext-demo/
├── src/
│   ├── components/
│   │   ├── dashboards/       # All dashboard components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.jsx        # Top navigation bar
│   │   ├── Sidebar.jsx       # Left sidebar navigation
│   │   └── KPICard.jsx       # Reusable KPI card component
│   ├── lib/
│   │   ├── mockData.js       # Mock data generators
│   │   └── utils.js          # Utility functions
│   ├── App.jsx               # Main app component with routing
│   ├── App.css               # Global styles and theme
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── index.html                # HTML template
├── package.json              # Dependencies
└── vite.config.js            # Vite configuration
```

## Customization

### Changing Mock Data
Edit `src/lib/mockData.js` to adjust the mock data generators or replace them with real API calls.

### Modifying Dashboards
Each dashboard is in `src/components/dashboards/`. Edit the corresponding file to customize.

### Updating Branding
Colors are defined in `src/App.css` under the `:root` section. Change the T-Mobile magenta or other brand colors there.

### Adding New Dashboards
1. Create a new component in `src/components/dashboards/`
2. Add the route in `src/App.jsx`
3. Add the menu item in `src/components/Sidebar.jsx`

## Troubleshooting

**Port 5173 already in use?**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build errors?**
Make sure you're using Node.js 18 or higher:
```bash
node --version
```

## Support

For questions or issues, refer to:
- README.md - Full documentation
- PRESENTATION_GUIDE.md - Presentation tips and talking points

---

**Ready to impress T-Mobile!** 🚀

