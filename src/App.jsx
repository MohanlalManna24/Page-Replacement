import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
const App = () => {
  const [algo, setAlgo] = useState('LRU');
  const [framesCount, setFramesCount] = useState(3);
  const [refStringInput, setRefStringInput] = useState('7, 0, 1, 2, 0, 3, 0, 4, 2, 3');
  const [currentStep, setCurrentStep] = useState(0);

  // Parse input string to array of numbers
  const referenceString = useMemo(() => {
    return refStringInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  }, [refStringInput]);

  // Simulation Logic
  const simulationData = useMemo(() => {
    let frames = Array(framesCount).fill(null);
    let history = [];
    let hits = 0;
    let faults = 0;
    
    // Trackers for algorithms
    let queue = []; // For FIFO
    let recentUse = []; // For LRU

    referenceString.forEach((page, currentIndex) => {
      let isHit = frames.includes(page);
      let victim = null;

      if (isHit) {
        hits++;
        if (algo === 'LRU') {
          recentUse = recentUse.filter(p => p !== page);
          recentUse.push(page);
        }
      } else {
        faults++;
        let emptyIndex = frames.indexOf(null);
        
        if (emptyIndex !== -1) {
          // Frame has empty space
          frames[emptyIndex] = page;
          if (algo === 'FIFO') queue.push(page);
          if (algo === 'LRU') recentUse.push(page);
        } else {
          // Page replacement needed
          if (algo === 'FIFO') {
            victim = queue.shift();
            let replaceIdx = frames.indexOf(victim);
            frames[replaceIdx] = page;
            queue.push(page);
          } 
          else if (algo === 'LRU') {
            victim = recentUse.shift();
            let replaceIdx = frames.indexOf(victim);
            frames[replaceIdx] = page;
            recentUse.push(page);
          } 
          else if (algo === 'Optimal') {
            let farthest = -1;
            let replaceIdx = -1;
            
            for (let i = 0; i < framesCount; i++) {
              let nextUse = referenceString.indexOf(frames[i], currentIndex + 1);
              if (nextUse === -1) {
                replaceIdx = i;
                break;
              }
              if (nextUse > farthest) {
                farthest = nextUse;
                replaceIdx = i;
              }
            }
            victim = frames[replaceIdx];
            frames[replaceIdx] = page;
          }
        }
      }

      history.push({
        pageReq: page,
        framesState: [...frames],
        isHit,
        victim
      });
    });

    return { history, totalHits: hits, totalFaults: faults };
  }, [referenceString, framesCount, algo]);

  // Reset step when settings change
  useEffect(() => {
    setCurrentStep(0);
  }, [algo, framesCount, refStringInput]);

  const handleNext = () => {
    if (currentStep < referenceString.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => setCurrentStep(0);

  // Calculate current hits and faults based on step
  const currentHits = simulationData.history.slice(0, currentStep).filter(s => s.isHit).length;
  const currentFaults = simulationData.history.slice(0, currentStep).filter(s => !s.isHit).length;

  return (
    <div className="app-shell">
      <div className="bg-orb orb-one" aria-hidden="true" />
      <div className="bg-orb orb-two" aria-hidden="true" />

      <main className="app-container">
        <header className="app-header">
          <p className="eyebrow">Virtual Memory Lab</p>
          <h1>Page Replacement Visualizer</h1>
        </header>

        <section className="glass-card visualization-card">
          <div className="section-head">
            <h2>Visualization</h2>
            <p>{currentStep}/{referenceString.length} steps played</p>
          </div>

          <div className="timeline-grid" role="region" aria-label="Simulation timeline">
            {referenceString.map((req, index) => {
              const stepData = simulationData.history[index];
              const isVisible = index < currentStep;
              const isCurrent = index === currentStep - 1;

              return (
                <div
                  key={index}
                  className={`step-column ${isVisible ? 'is-visible' : 'is-pending'} ${isCurrent ? 'is-current' : ''}`}
                >
                  <div className="request-badge">{req}</div>

                  <div className="frame-stack">
                    {isVisible && stepData.framesState.map((frame, fIndex) => (
                      <div
                        key={fIndex}
                        className={`frame-cell
                          ${frame === null ? 'is-empty' : ''}
                          ${isCurrent && frame === req && stepData.isHit ? 'is-hit' : ''}
                          ${isCurrent && frame === req && !stepData.isHit ? 'is-fault' : ''}`}
                      >
                        {frame !== null ? frame : '-'}
                      </div>
                    ))}

                    {!isVisible && Array(framesCount).fill(null).map((_, i) => (
                      <div key={i} className="frame-cell is-empty">-</div>
                    ))}
                  </div>

                  {isVisible && (
                    <div className={`state-chip ${stepData.isHit ? 'chip-hit' : 'chip-fault'}`}>
                      {stepData.isHit ? 'Hit' : 'Fault'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass-card controls-card">
          <div className="section-head">
            <h2>Controls</h2>
            <p>Configure and step through the simulation.</p>
          </div>

          <div className="controls-grid">
            <label className="field-group">
              <span>Algorithm</span>
              <select value={algo} onChange={(e) => setAlgo(e.target.value)}>
                <option value="FIFO">FIFO</option>
                <option value="LRU">LRU</option>
                <option value="Optimal">Optimal</option>
              </select>
            </label>

            <label className="field-group">
              <span>Frames</span>
              <input
                type="number"
                min="1"
                max="10"
                value={framesCount}
                onChange={(e) => setFramesCount(parseInt(e.target.value, 10) || 3)}
              />
            </label>

            <label className="field-group field-wide">
              <span>Reference String</span>
              <input
                type="text"
                value={refStringInput}
                onChange={(e) => setRefStringInput(e.target.value)}
                placeholder="Example: 7, 0, 1, 2, 0, 3, 0"
              />
            </label>
          </div>

          <div className="controls-footer">
            <div className="button-row">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={currentStep >= referenceString.length}
              >
                Next Step
              </button>

              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>

            <div className="metrics-row">
              <div className="metric metric-hit">Hits: {currentHits}</div>
              <div className="metric metric-fault">Faults: {currentFaults}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;