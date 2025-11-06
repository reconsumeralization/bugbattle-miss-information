

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramRendererProps {
  mermaidSyntax: string;
  onNodeClick?: (nodeId: string) => void;
}

// Initialize Mermaid a single time
let mermaidInitialized = false;
const initializeMermaid = () => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false, // We will explicitly render
      theme: 'dark', 
      darkMode: true,
      themeVariables: {
        background: '#111827', 
        mainBkg: '#1f2937',    
        primaryColor: '#3b82f6', 
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#2563eb', 
        lineColor: '#9ca3af', 
        textColor: '#f3f4f6', 
      }
    });
    mermaidInitialized = true;
  }
};


export const MermaidDiagramRenderer: React.FC<MermaidDiagramRendererProps> = ({ mermaidSyntax, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [mermaidBindFunctions, setMermaidBindFunctions] = useState<((element: Element) => void) | undefined>(undefined);

  useEffect(() => {
    initializeMermaid();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (mermaidSyntax) {
      setError(null);
      const renderGraph = async () => {
        try {
          // Using a unique ID for rendering is good practice for mermaid.render
          const uniqueId = 'mermaid-graph-' + Date.now();
          const { svg, bindFunctions } = await mermaid.render(uniqueId, mermaidSyntax);
          if (isMounted) {
            setSvgContent(svg);
            setMermaidBindFunctions(() => bindFunctions); // Store bindFunctions to be called after SVG is in DOM
          }
        } catch (e: any) {
          console.error("Mermaid rendering error:", e);
          if (isMounted) {
            setError("Failed to render diagram: " + e.message);
            setSvgContent('');
            setMermaidBindFunctions(undefined);
          }
        }
      };
      renderGraph();
    } else {
      if (isMounted) {
        setSvgContent(''); // Clear if no syntax
        setError(null);
        setMermaidBindFunctions(undefined);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [mermaidSyntax]);

  useEffect(() => {
    if (svgContent && containerRef.current) {
      // Call Mermaid's bindFunctions if it exists, now that SVG is in the DOM
      if (mermaidBindFunctions) {
        mermaidBindFunctions(containerRef.current);
      }

      // Set up custom node click listeners
      if (onNodeClick) {
        const nodes = containerRef.current.querySelectorAll('.node');
        nodes.forEach(nodeEl => {
          const htmlNode = nodeEl as HTMLElement; // Cast to HTMLElement
          const nodeId = htmlNode.id; 
          
          // Extract the original node ID if Mermaid prefixes it
          // Common prefixes are 'flowchart-NODEID-idx' or just 'NODEID'
          let originalNodeId = nodeId;
          const flowchartPrefix = 'flowchart-';
          if (nodeId.startsWith(flowchartPrefix)) {
            const idParts = nodeId.substring(flowchartPrefix.length).split('-');
            if (idParts.length > 1) { // Check if there's more than just the ID part (e.g., a counter suffix)
              originalNodeId = idParts.slice(0, -1).join('-'); // Join all parts except the last (counter)
            } else {
              originalNodeId = idParts[0];
            }
          }
          // This logic might need to be more robust depending on how complex your node IDs are
          // and how Mermaid versions handle ID generation for different diagram types.
          // For simple IDs like 'project_path_vuln_name', it should work.
          // For IDs that might contain hyphens themselves, more care is needed.
          // For this VTF, node IDs like 'google_ai_studio_session_page_hardcoded_static_api_ke' are common.
          
          // Check if the listener is already added to prevent duplicates
          if (originalNodeId && !htmlNode.getAttribute('data-click-listener-added')) {
            htmlNode.addEventListener('click', () => {
              onNodeClick(originalNodeId);
            });
            htmlNode.setAttribute('data-click-listener-added', 'true');
            htmlNode.style.cursor = 'pointer';
          }
        });
      }
    }
  }, [svgContent, onNodeClick, mermaidBindFunctions]);


  return (
    <div className="w-full overflow-x-auto p-4 bg-surface rounded-lg shadow-lg">
      {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
      <div 
        ref={containerRef} 
        className="mermaid-diagram-container"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      >
      </div>
      {!svgContent && !error && <p className="text-on-surface-muted">Generating diagram...</p>}
    </div>
  );
};