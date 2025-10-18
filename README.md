# Multi-Warehouse Inventory Management System

## Overview

A comprehensive Multi-Warehouse Inventory Management System built with Next.js and Material-UI (MUI) for GreenSupply Co, a sustainable product distribution company. This production-ready system efficiently tracks inventory across multiple warehouse locations, manages stock movements, monitors inventory values, and prevents stockouts.

## 🎯 Business Context

GreenSupply Co distributes eco-friendly products across multiple warehouse locations throughout North America. This system provides warehouse managers with actionable insights, streamlines stock transfers between warehouses, and proactively manages inventory levels through intelligent alert systems.

## 🛠️ Tech Stack

- **Next.js 15.0.3** - React framework with Pages Router
- **Material-UI (MUI) 6.1.7** - Modern UI component library
- **React 18.2.0** - JavaScript library
- **TypeScript 5.9.3** - Type safety and development experience
- **React Query (@tanstack/react-query 5.90.3)** - Server state management
- **React Hook Form 7.65.0** - Form handling with validation
- **Zod 4.1.12** - Schema validation
- **Axios 1.12.2** - HTTP client
- **React Hot Toast 2.6.0** - User notifications
- **JSON file storage** - Data persistence (for assessment)

## ✨ Key Features

### 🏠 Enhanced Dashboard

- **Modern, Professional UI** with eco-friendly design theme
- **Key Business Metrics** including inventory value, stock levels, warehouse counts, and active alerts
- **Responsive Design** that works seamlessly across all device sizes
- **Real-time Data** with proper loading states and error handling
- **Quick Actions** for common warehouse operations
- **Inventory Overview** with enhanced usability and visual indicators

### 📦 Stock Transfer System

- **Complete Transfer Workflow** with proper business logic and validation
- **Data Integrity** with automatic stock level updates across warehouses
- **Transfer History** tracking with comprehensive audit trail
- **Intuitive UI** for warehouse managers performing daily operations
- **Error Handling** with user-friendly feedback and validation

### 🚨 Low Stock Alert & Reorder System

- **Intelligent Alert System** that identifies products needing reordering
- **Smart Classification** (Critical, Low, Adequate, Overstocked)
- **Actionable Recommendations** with suggested reorder quantities
- **Status Workflow** (New → Acknowledged → Ordered → Resolved)
- **Dashboard Integration** for immediate visibility of critical alerts

## 📋 System Architecture

### Data Models

- **Products**: SKU, name, category, unit cost, reorder point
- **Warehouses**: Name, location, code
- **Stock**: Product-warehouse quantity tracking
- **Transfers**: Inter-warehouse movement records
- **Alerts**: Low stock notifications with status tracking

### API Endpoints

- `/api/products` - Product CRUD operations
- `/api/warehouses` - Warehouse management
- `/api/stock` - Stock level management
- `/api/transfers` - Transfer operations
- `/api/alerts` - Alert management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run next's lint
npm run type-check   # Run TypeScript type checking
```

## 📁 Project Structure

```
inventory-management-task/
├── data/                    # JSON data files
│   ├── products.json       # Product catalog
│   ├── warehouses.json     # Warehouse locations
│   ├── stock.json          # Stock levels
│   ├── transfers.json      # Transfer history
│   └── alerts.json         # Alert tracking
├── src/
│   ├── components/         # UI components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── products/       # Product management
│   │   ├── warehouses/     # Warehouse management
│   │   ├── stock/          # Stock management
│   │   ├── transfers/      # Transfer system
│   │   └── alerts/         # Alert system
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Next.js pages and API routes
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
└── package.json
```

## 🎨 Design System

### Theme

- **Color Palette**: Eco-friendly greens and blues with professional grays
- **Typography**: Inter font family for modern readability
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle elevation with hover effects
- **Border Radius**: 12px for cards, 8px for buttons

### Responsive Breakpoints

- **Mobile**: < 700px (card layout)
- **Tablet**: 700px - 1024px (hybrid layout)
- **Desktop**: > 1024px (full table layout)

## 🔧 Technical Implementation

### State Management

- **React Query** for server state management
- **React Hook Form** for form state
- **Zod** for runtime validation
- **Custom hooks** for data fetching and mutations

### Data Validation

- **Zod schemas** for type-safe validation
- **Form validation** with real-time feedback
- **API validation** with proper error handling
- **Business logic validation** (e.g., transfer constraints)

### Performance Optimizations

- **Code splitting** with Next.js dynamic imports
- **Optimistic updates** for better UX
- **Efficient re-renders** with proper dependency arrays

### Data Setup

```bash
# The system comes with sample data in the data/ directory
# Modify values in JSON files to test different scenarios
```

## 📊 Implementation Summary

### Developer Information

- **Name**: Amirhossien Mosavi
- **Completion Time**: ~20hours
- **Date**: 10/18/2025

### Features Completed ✅

- ✅ **Task 1**: Redesigned Dashboard with modern UI and responsive design
- ✅ **Task 2**: Complete Stock Transfer System with validation and history
- ✅ **Task 3**: Low Stock Alert & Reorder System with intelligent classification
- ✅ **Additional**: Enhanced UX with loading states, error handling, and notifications

### Key Technical Decisions

1. **Architecture**: Next.js with Pages Router for modern React patterns
2. **State Management**: React Query for efficient server state management
3. **Form Handling**: React Hook Form with Zod validation for type safety
4. **UI Framework**: Material-UI for consistent, accessible components
5. **Data Persistence**: JSON files for simplicity (easily replaceable with database)
6. **Responsive Design**: Mobile-first approach with progressive enhancement
7. **Error Handling**: Comprehensive error boundaries and user feedback
8. **Performance**: Optimized re-renders and efficient data fetching

### Known Limitations

- **Data Persistence**: Currently uses JSON files (production would need database)
- **Authentication**: No user authentication system implemented
- **Bulk Operations**: Limited bulk transfer capabilities
- **Reporting**: Basic metrics only (could be enhanced with advanced analytics)

### New Dependencies Added

- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **react-hook-form**: Advanced form handling
- **zod**: Runtime type validation
- **react-hot-toast**: User notification system
- **axios**: HTTP client for API calls
- **typescript** - Type safety and development experience

### Video Walkthrough

[Link to video demonstration will be provided here soon]

### Live Demo

[text](https://inventory-management-task-pied.vercel.app/)

- **User cannot Add or Edit Any Data on Live Demo**
- Read-only operations (fs.readFileSync) are allowed on Vercel
- Write operations (fs.writeFileSync) are NOT allowed on Vercel

---

## 📝 License

This project is created for assessment purposes. All rights reserved.
