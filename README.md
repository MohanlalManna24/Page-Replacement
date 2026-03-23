# Page Fault - Page Replacement Visualizer

A modern React application for visualizing page replacement algorithms used in Operating Systems.

This project provides an interactive step-by-step simulation to help students and developers understand how different page replacement strategies behave under the same reference string.

## Features

- Interactive simulation of the following algorithms:
	- FIFO (First-In, First-Out)
	- LRU (Least Recently Used)
	- Optimal
- Configurable number of memory frames
- Custom reference string input
- Step-by-step execution with live frame state updates
- Real-time hit and fault counters
- Clean visual timeline for each page request

## Tech Stack

- React 19
- Vite 8
- ESLint 9
- Tailwind CSS 4 (installed in project dependencies)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (recommended)

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Then open the local URL shown in the terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build production assets
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint checks

## How to Use

1. Select an algorithm (`FIFO`, `LRU`, or `Optimal`).
2. Set the number of frames.
3. Enter a comma-separated reference string (example: `7, 0, 1, 2, 0, 3, 0, 4`).
4. Click **Next Step** to simulate each request.
5. Use **Reset** to restart the simulation from the beginning.

## Project Structure

```text
src/
	App.jsx        # Core simulation logic and UI
	App.css        # Component-specific styling
	index.css      # Global styles
	main.jsx       # React app entry point
```

## Build for Production

```bash
npm run build
```

The production-ready files are generated in the `dist/` directory.

## License

This project is for educational and learning purposes.
