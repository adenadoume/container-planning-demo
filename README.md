# Container Planning & Management System

A modern, full-stack container logistics management application built with React, TypeScript, and Supabase.

![Container Planning Demo](https://img.shields.io/badge/Demo-Live-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## Features

### Container Management
- Track multiple shipping containers with real-time status updates
- Color-coded arrival status (not arrived → at port → at warehouse)
- Inline editing with auto-save functionality

### Supplier Management
- Complete supplier database with contact information
- Track payments, production status, and delivery timelines
- Move suppliers between containers with drag-and-drop

### Arrivals Tracking
- Visual arrival status indicators
- Port-to-warehouse tracking with date-based status
- Green (arrived) / Yellow (in transit) / Blue (pending) indicators

### Excel Integration
- Export to styled Excel files with formatting
- Import from Excel with data validation
- Merged headers and formula support

### Order Specification Documents
- Generate professional order documents
- Multi-column pricing calculations
- Profit margin analysis

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Ant Design + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **State Management**: Refine.dev framework
- **Excel**: xlsx-js-style for import/export

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/container-planning-demo.git
cd container-planning-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL files in the `sql/` folder in order:
   - `01_create_tables.sql` - Creates database schema
   - `02_demo_data.sql` - Adds sample data

## Screenshots

### Container Items View
Dark-themed table with inline editing, status indicators, and Excel export.

### Arrivals Tracking
Color-coded arrival status with checkmarks for delivered containers.

### Supplier Management
Complete supplier database with contact details and payment tracking.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/
│   ├── arrivals/     # Arrival tracking page
│   ├── container-items/  # Container management
│   ├── entypo-paralavis/ # Order documents
│   └── suppliers/    # Supplier management
├── services/         # API and Supabase client
└── App.tsx          # Main application routes
```

## License

MIT License - feel free to use for personal or commercial projects.

## Author

Built with ❤️ using modern web technologies.
