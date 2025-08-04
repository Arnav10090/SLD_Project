# DOL Motor Starter Control Circuit Simulator

A modern, interactive web application that simulates a Direct-On-Line (DOL) motor starter control circuit with real-time visual feedback and animations, built with Next.js and shadcn/ui.

## 🎯 Overview

This simulator provides a realistic representation of a DOL motor starter system, allowing users to interact with START/STOP controls and observe real-time circuit behavior with a clean, modern interface.

## ✨ Features

### Core Functionality
- **Interactive Control Circuit**: SVG-based electrical schematic with clickable components
- **Real-time Motor Control**: START/STOP button operations with proper interlocking
- **Visual Feedback**: Clear status indicators and operational states
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Technical Implementation
- **Modern Stack**: Built with Next.js 13+ and TypeScript
- **UI Components**: Utilizes shadcn/ui for consistent, accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React hooks for efficient state management
- **Type Safety**: Full TypeScript support throughout the application

### User Experience
- **Intuitive Interface**: Clean, professional design with clear visual hierarchy
- **Responsive Controls**: Optimized for both mouse and touch interactions
- **Accessibility**: Built with accessibility in mind using Radix UI primitives
- **Performance**: Optimized for fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SLD_project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with fonts and providers
│   └── globals.css        # Global styles and Tailwind imports
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── (custom components) # Application-specific components
├── lib/                   # Utility functions and configurations
│   ├── utils.ts           # Helper functions
│   └── animations.ts      # Animation configurations
├── hooks/                 # Custom React hooks
│   └── useMotorControl.tsx # Motor control logic
├── public/                # Static assets
└── styles/                # Global styles (if any)
```

## 🎮 Usage Guide

### Basic Operation

1. **Starting the Motor**:
   - Ensure MCB is closed (yellow button shows "OPEN MCB" when ready)
   - Click the green **START** button
   - Observe current flow animation through the control circuit
   - Watch motor speed ramp up to 1500 RPM
   - Monitor contactor energization and auxiliary contact closure

2. **Stopping the Motor**:
   - Click the red **STOP** button
   - Observe contactor de-energization
   - Watch motor coast down to zero RPM
   - Note current flow cessation

3. **Emergency Stop**:
   - Click **EMERGENCY STOP** for immediate shutdown
   - System requires fault reset before restart

4. **Fault Conditions**:
   - Toggle MCB to simulate power interruption
   - Observe overload protection behavior
   - Use **RESET FAULT** to clear fault conditions

### System Monitoring

- **Motor Status**: Real-time operational state display
- **Speed Display**: Current RPM with visual indicator
- **Runtime Counter**: Accumulated running time (HH:MM:SS)
- **Component Health**: MCB, overload, and contactor status
- **Fault Display**: Active fault conditions and descriptions

## 🔧 Technical Details

### State Management
The application uses a reducer-based state management system with the following states:
- `STOPPED`: Motor is not running
- `STARTING`: Motor is accelerating to full speed
- `RUNNING`: Motor is at full speed
- `STOPPING`: Motor is decelerating
- `FAULT`: System fault condition active

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
