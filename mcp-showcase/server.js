const express = require('express');
const path = require('path');
const app = express();
const PORT = process.argv[2] || 3000;

app.use(express.json());
app.use(express.static('public'));

const baseHTML = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 20px; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: transparent; }
    * { box-sizing: border-box; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e5e7eb; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
    .grid { display: grid; gap: 15px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;
    ${bodyContent}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
`;

function getUIBundle(type) {
    const t = type ? type.toLowerCase() : '';

    if (t.includes('mindmap') || t.includes('topology') || t.includes('architecture')) {
        return baseHTML("Architecture Mindmap", `
            function App() {
                const [selectedNode, setSelectedNode] = React.useState(null);
                const nodes = [
                    { id: 'lb', label: 'Load Balancer', cx: 250, cy: 50, color: '#8b5cf6', desc: 'Distributes incoming traffic across web servers.' },
                    { id: 'web1', label: 'Web Srv 1', cx: 150, cy: 150, color: '#3b82f6', desc: 'Primary application server (Node.js/Express).' },
                    { id: 'web2', label: 'Web Srv 2', cx: 350, cy: 150, color: '#3b82f6', desc: 'Secondary application server (Node.js/Express).' },
                    { id: 'db', label: 'Database cluster', cx: 250, cy: 250, color: '#10b981', desc: 'PostgreSQL Main Cluster.' },
                    { id: 'cache', label: 'Redis Cache', cx: 450, cy: 250, color: '#ef4444', desc: 'In-memory session & query caching.' }
                ];
                const edges = [
                    { from: 'lb', to: 'web1' }, { from: 'lb', to: 'web2' },
                    { from: 'web1', to: 'db' }, { from: 'web2', to: 'db' },
                    { from: 'web2', to: 'cache' }
                ];

                return (
                    <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1, position: 'relative', background: '#f8fafc', overflow: 'hidden' }}>
                            <svg width="100%" height="350">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                    </marker>
                                </defs>
                                {edges.map((edge, i) => {
                                    const fromNode = nodes.find(n => n.id === edge.from);
                                    const toNode = nodes.find(n => n.id === edge.to);
                                    return (
                                        <line key={i} x1={fromNode.cx} y1={fromNode.cy} x2={toNode.cx} y2={toNode.cy} 
                                              stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                    );
                                })}
                                {nodes.map(node => (
                                    <g key={node.id} onClick={() => setSelectedNode(node)} style={{cursor: 'pointer'}}>
                                        <circle cx={node.cx} cy={node.cy} r="35" fill={selectedNode?.id === node.id ? '#1e293b' : node.color} 
                                            stroke="#fff" strokeWidth="3" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))', transition: 'all 0.3s' }}/>
                                        <text x={node.cx} y={node.cy + 55} textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">{node.label}</text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                        <div style={{ width: '250px', borderLeft: '1px solid #e2e8f0', padding: '20px', background: 'white' }}>
                            <h3 style={{marginTop: 0, fontSize: '1rem', color: '#0f172a'}}>Node Inspector</h3>
                            {selectedNode ? (
                                <div>
                                    <div style={{ padding: '4px 8px', background: selectedNode.color, color: 'white', display: 'inline-block', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>{selectedNode.label}</div>
                                    <p style={{fontSize: '0.9rem', color: '#475569', lineHeight: '1.5'}}>{selectedNode.desc}</p>
                                    <div style={{ marginTop: '20px', padding: '10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'monospace' }}>Status: HEALTHY<br/>Uptime: 99.9%</div>
                                </div>
                            ) : (
                                <p style={{fontSize: '0.9rem', color: '#94a3b8'}}>Click a node in the topology graph to view details.</p>
                            )}
                        </div>
                    </div>
                );
            }
        `);
    } else if (t.includes('dashboard') || t.includes('metrics')) {
        return baseHTML("System Dashboard", `
            function App() {
                const [logs, setLogs] = React.useState([]);
                const [cpu, setCpu] = React.useState(42);

                React.useEffect(() => {
                    const timer = setInterval(() => {
                        setCpu(Math.floor(Math.random() * 40) + 30);
                        setLogs(prev => {
                            const newLog = \`[\${new Date().toLocaleTimeString()}] HTTP 200 GET /api/v1/data - \${Math.floor(Math.random() * 50)}ms\`;
                            return [newLog, ...prev].slice(0, 5);
                        });
                    }, 2000);
                    return () => clearInterval(timer);
                }, []);

                return (
                    <div className="card" style={{ background: '#0f172a', color: 'white', border: 'none', height: '350px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{margin: 0, fontSize: '1.2rem', color: '#f8fafc'}}>Live System Telemetry</h2>
                            <span style={{ padding: '4px 12px', background: '#10b981', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>● LIVE</span>
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#94a3b8' }}>CPU Usage</p>
                                <div style={{ display: 'flex', alignItems: 'end', gap: '10px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>{cpu}%</span>
                                    <div style={{ flex: 1, height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                                        <div style={{ width: \`\${cpu}%\`, height: '100%', background: cpu > 60 ? '#ef4444' : '#3b82f6', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#94a3b8' }}>Memory Allocation</p>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>2.4 <span style={{fontSize: '1rem', color: '#94a3b8'}}>GB</span></span>
                            </div>
                        </div>
                        <div style={{ background: '#020617', padding: '15px', borderRadius: '8px', marginTop: '15px', flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', color: '#10b981', overflow: 'hidden' }}>
                            {logs.length === 0 ? 'Awaiting telemetry...' : logs.map((log, i) => (
                                <div key={i} style={{ opacity: 1 - (i * 0.2), padding: '2px 0' }}>{log}</div>
                            ))}
                        </div>
                    </div>
                );
            }
        `);
    } else if (t.includes('chart') || t.includes('analytics')) {
        return baseHTML("Analytics Chart", `
            function App() {
                const [hoveredPoint, setHoveredPoint] = React.useState(null);
                const data = [
                    { month: 'Jan', revenue: 4000, users: 2400 },
                    { month: 'Feb', revenue: 3000, users: 1398 },
                    { month: 'Mar', revenue: 2000, users: 9800 },
                    { month: 'Apr', revenue: 2780, users: 3908 },
                    { month: 'May', revenue: 1890, users: 4800 },
                    { month: 'Jun', revenue: 2390, users: 3800 },
                    { month: 'Jul', revenue: 3490, users: 4300 },
                ];

                const maxRevenue = Math.max(...data.map(d => d.revenue));
                const height = 250;
                const width = 600;
                const padding = 40;

                const getX = (index) => padding + (index * ((width - padding * 2) / (data.length - 1)));
                const getY = (val) => height - padding - ((val / maxRevenue) * (height - padding * 2));

                const points = data.map((d, i) => \`\${getX(i)},\${getY(d.revenue)}\`).join(' ');
                const areaPath = \`M \${getX(0)},\${height - padding} L \${points} L \${getX(data.length - 1)},\${height - padding} Z\`;

                return (
                    <div className="card" style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #333' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600, color: '#f8fafc' }}>Revenue Analytics</h2>
                            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Monthly recurring revenue (MRR) growth over time.</p>
                        </div>
                        
                        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
                            <svg viewBox={\`0 0 \${width} \${height}\`} style={{ width: '100%', minWidth: '500px', height: 'auto', overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4].map(i => (
                                    <g key={i}>
                                        <line 
                                            x1={padding} 
                                            y1={height - padding - (i * ((height - padding * 2) / 4))} 
                                            x2={width - padding} 
                                            y2={height - padding - (i * ((height - padding * 2) / 4))} 
                                            stroke="#334155" 
                                            strokeDasharray="4 4" 
                                        />
                                        <text 
                                            x={padding - 10} 
                                            y={height - padding - (i * ((height - padding * 2) / 4)) + 4} 
                                            fill="#64748b" 
                                            fontSize="10" 
                                            textAnchor="end"
                                        >
                                            {"$"}{(maxRevenue * (i / 4)).toFixed(0)}
                                        </text>
                                    </g>
                                ))}

                                {/* Area */}
                                <path d={areaPath} fill="url(#areaGradient)" style={{ transition: 'all 0.5s ease' }} />
                                
                                {/* Line */}
                                <polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="3" style={{ transition: 'all 0.5s ease' }} />

                                {/* Data Points & Tooltips */}
                                {data.map((d, i) => {
                                    const cx = getX(i);
                                    const cy = getY(d.revenue);
                                    const isHovered = hoveredPoint === i;
                                    return (
                                        <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                                            {/* Vertical highlight line on hover */}
                                            {isHovered && (
                                                <line x1={cx} y1={padding} x2={cx} y2={height - padding} stroke="#cbd5e1" strokeDasharray="2 2" />
                                            )}
                                            
                                            <circle cx={cx} cy={cy} r={isHovered ? 6 : 4} fill={isHovered ? '#fff' : '#8b5cf6'} stroke="#fff" strokeWidth={isHovered ? 2 : 1} style={{ transition: 'all 0.2s ease' }} />
                                            
                                            {/* X-Axis Labels */}
                                            <text x={cx} y={height - padding + 20} fill={isHovered ? '#f8fafc' : '#94a3b8'} fontSize="11" textAnchor="middle" fontWeight={isHovered ? 'bold' : 'normal'} style={{ transition: 'all 0.2s ease' }}>
                                                {d.month}
                                            </text>
                                            
                                            {/* Tooltip */}
                                            {isHovered && (
                                                <g>
                                                    <rect x={cx - 35} y={cy - 40} width="70" height="25" rx="4" fill="#0f172a" stroke="#334155" />
                                                    <text x={cx} y={cy - 23} fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">{"$"}{d.revenue}</text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                );
            }
        `);
    } else {
        return baseHTML("Custom Domain Setup", `
            function App() {
                const [currentStep, setCurrentStep] = React.useState(1);
                const steps = [
                  { id: 1, title: 'Initialize Setup', desc: 'Validating configuration...' },
                  { id: 2, title: 'Provision Resources', desc: 'Allocating domain and servers...' },
                  { id: 3, title: 'Deploy App', desc: 'Running build and deploying...' },
                  { id: 4, title: 'Complete', desc: 'Ready for traffic.' },
                ];
                React.useEffect(() => {
                  const timer = setInterval(() => setCurrentStep(p => p < 4 ? p + 1 : p), 1500);
                  return () => clearInterval(timer);
                }, []);
                return (
                  <div className="card">
                    <h2 style={{marginTop: 0, color: '#111827'}}>Custom Domain Setup</h2>
                    <p style={{color: '#6b7280', marginBottom: '24px'}}>Automatically updating via React state...</p>
                    <div>
                      {steps.map((step, index) => {
                        const isDone = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        let circleClass = 'circle pending';
                        if (isDone) circleClass = 'circle done';
                        if (isActive) circleClass = 'circle active';
                        return (
                          <div key={step.id} style={{ display: 'flex', marginBottom: index === steps.length - 1 ? 0 : '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '15px' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: isDone || isActive ? 'white' : '#6b7280', background: isDone ? '#10b981' : isActive ? '#3b82f6' : '#e5e7eb', boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none', transition: 'all 0.5s ease' }}>
                                {isDone ? '✓' : step.id}
                              </div>
                              {index < steps.length - 1 && (
                                <div style={{ width: '2px', height: '40px', background: isDone ? '#10b981' : '#e5e7eb', marginTop: '8px' }}></div>
                              )}
                            </div>
                            <div style={{ paddingTop: '4px' }}>
                              <p style={{ fontSize: '1.1rem', color: '#111827', margin: 0, fontWeight: 600 }}>{step.title}</p>
                              <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
            }
        `);
    }
}

app.get('/view/:type', (req, res) => {
    res.send(getUIBundle(req.params.type));
});

app.post('/api/mcp/tool', (req, res) => {
    const { prompt } = req.body;
    res.json({
        textSummary: `Rendered ${prompt} UI`,
        uiBundle: getUIBundle(prompt)
    });
});

app.listen(PORT, () => {
    console.log(`MCP Showcase running at http://localhost:${PORT}`);
});
