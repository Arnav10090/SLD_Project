# DOL Motor Starter Control Circuit Simulator

A comprehensive, interactive web application that simulates a Direct-On-Line (DOL) motor starter control circuit with real-time visual feedback and animations.

## 🎯 Overview

This simulator provides a realistic representation of a DOL motor starter system, allowing users to interact with START/STOP controls and observe real-time circuit behavior, current flow visualization, and motor operation dynamics.

## ✨ Features

### Core Functionality
- **Interactive Control Circuit**: SVG-based electrical schematic with clickable components
- **Real-time Motor Control**: START/STOP button operations with proper interlocking
- **Visual Current Flow**: Animated current path visualization through circuit components
- **Motor Animation**: Realistic 3D motor rotation with RPM display and speed ramping
- **Safety Systems**: MCB, overload protection, and emergency stop functionality

### Advanced Features
- **State Management**: Comprehensive motor control states (STOPPED, STARTING, RUNNING, STOPPING, FAULT)
- **System Monitoring**: Real-time status display with component health indicators
- **Fault Simulation**: Overload trip simulation and fault reset capabilities
- **Educational Interface**: Component tooltips and operational explanations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Visual Design
- **Industrial Theme**: Professional electrical schematic appearance
- **Modern UI**: Dark theme with accent colors and glass morphism effects
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Status Indicators**: Color-coded system health and operational status
- **Touch-Friendly**: Mobile-optimized controls with haptic feedback

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion for smooth, performant animations
- **State Management**: React Context with useReducer hook
- **Icons**: Lucide React for consistent iconography
- **TypeScript**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dol-motor-starter-simulator
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
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with fonts
│   └── globals.css        # Global styles and animations
├── components/            # React components
│   ├── ControlCircuit.tsx # Interactive control circuit diagram
│   ├── PowerCircuit.tsx   # Three-phase power circuit display
│   ├── ControlPanel.tsx   # START/STOP control interface
│   ├── StatusDisplay.tsx  # System status and monitoring
│   ├── MotorAnimation.tsx # 3D motor rotation animation
│   ├── CurrentFlow.tsx    # Animated current flow indicators
│   └── MotorStarterSimulator.tsx # Main layout component
├── hooks/                 # Custom React hooks
│   └── useMotorControl.tsx # Motor control state management
└── lib/                   # Utility libraries
    └── animations.ts      # Framer Motion animation presets
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

## 🎨 Customization

### Theme Customization
- Modify `tailwind.config.ts` for color scheme changes
- Update CSS custom properties in `globals.css`
- Adjust component-specific styling in individual components

### Animation Settings
- Configure animation parameters in `lib/animations.ts`
- Modify motor rotation speed in `MotorAnimation.tsx`
- Adjust current flow timing in `CurrentFlow.tsx`

### Circuit Modifications
- Update SVG paths in `ControlCircuit.tsx` and `PowerCircuit.tsx`
- Add new components by extending the circuit diagrams
- Implement additional safety features in the state management

## 🔧 Technical Details

### State Management
The application uses a reducer-based state management system with the following states:
- `STOPPED`: Motor is not running
- `STARTING`: Motor is accelerating to full speed
- `RUNNING`: Motor is at full speed
- `STOPPING`: Motor is decelerating
- `FAULT`: System fault condition active

### Animation System
- **Framer Motion**: Handles all UI animations and transitions
- **CSS Animations**: Used for continuous effects like current flow
- **SVG Animations**: Circuit component state changes and indicators
- **Performance Optimized**: 60fps animations with hardware acceleration

### Responsive Design
- **Mobile First**: Optimized for touch interfaces
- **Breakpoints**: Custom responsive layouts for different screen sizes
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized images and lazy loading

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Electrical engineering principles and DOL starter circuit design
- Industrial automation standards and practices
- Modern web development best practices
- Accessibility guidelines and inclusive design principles

## 📞 Support

For questions, issues, or feature requests, please open an issue on the GitHub repository or contact the development team.

---

**Note**: This simulator is designed for educational purposes and should not be used as a substitute for proper electrical engineering design and safety protocols in real-world applications.
