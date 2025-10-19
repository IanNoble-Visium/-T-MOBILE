import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { NODE_TYPES, EDGE_TYPES } from '@/lib/networkDataset'
import { LAYOUT_OPTIONS } from '@/lib/graphLayouts'
import { getNodeImage } from '@/lib/nodeImageManager'

/**
 * Enhanced NetworkTopologyVisualization Component
 * Features:
 * - SVG node images from Cloudinary/Recraft
 * - Bandwidth-based edge thickness
 * - Utilization-based edge coloring
 * - Alarm-triggered visual effects (flashing, highlighting, animation)
 */
const NetworkTopologyVisualizationEnhanced = ({
  nodes = [],
  edges = [],
  onNodeClick = null,
  onEdgeClick = null,
  selectedNodeId = null,
  selectedEdgeId = null,
  alarmedNodeIds = [],
  alarmedEdgeIds = [],
  layout = 'force'
}) => {
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [nodeImages, setNodeImages] = useState({})
  const hoveredNodeRef = useRef(null)
  const hoveredEdgeRef = useRef(null)
  const linkRef = useRef(null)
  const nodeRef = useRef(null)
  const labelsRef = useRef(null)

  // Load node images
  useEffect(() => {
    const loadImages = async () => {
      const images = {}

      for (const node of nodes) {
        try {
          // Only try to get existing images from cache/Cloudinary
          // Do NOT auto-generate here - use batch generation instead
          let imageUrl = await getNodeImage(node, false)

          if (imageUrl) {
            images[node.id] = imageUrl
          }
        } catch (error) {
          console.error(`Error loading image for node ${node.id}:`, error)
        }
      }

      console.log(`Loaded ${Object.keys(images).length} node images from cache/Cloudinary`)
      setNodeImages(images)
    }

    if (nodes.length > 0) {
      loadImages()
    }
  }, [nodes])

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  /**
   * Calculate edge thickness based on bandwidth
   * Higher bandwidth = thicker line
   */
  const getEdgeThickness = (edge) => {
    const bandwidth = edge.bandwidth || 10
    // Map bandwidth (10-100) to thickness (1-8)
    const minBandwidth = 10
    const maxBandwidth = 100
    const minThickness = 1
    const maxThickness = 8
    
    const thickness = minThickness + (bandwidth - minBandwidth) / (maxBandwidth - minBandwidth) * (maxThickness - minThickness)
    return Math.max(minThickness, Math.min(maxThickness, thickness))
  }

  /**
   * Calculate edge color based on utilization
   * Low utilization = green, medium = yellow, high = red
   */
  const getEdgeColor = (edge) => {
    const utilization = edge.utilization || 0
    
    if (utilization < 40) {
      return '#00A651' // Green - low utilization
    } else if (utilization < 70) {
      return '#FFB81C' // Yellow - medium utilization
    } else {
      return '#E4002B' // Red - high utilization
    }
  }

  // Render D3 visualization
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const { width, height } = dimensions

    // Create a deep copy of nodes to avoid mutating original data
    const nodesCopy = nodes.map(n => ({ ...n }))
    const edgesCopy = edges.map(e => ({
      ...e,
      source: typeof e.source === 'object' ? e.source.id : e.source,
      target: typeof e.target === 'object' ? e.target.id : e.target
    }))

    // Create simulation based on selected layout
    const layoutCreator = LAYOUT_OPTIONS[layout]?.create || LAYOUT_OPTIONS.force.create
    const simulation = layoutCreator(nodesCopy, edgesCopy, width, height)

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Add defs for patterns and filters
    const defs = svg.append('defs')
    
    // Add glow filter for alarmed elements
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur')
    
    const feMerge = glowFilter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Add zoom behavior
    const g = svg.append('g')
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)

    // Create links with bandwidth-based thickness and utilization-based color
    const link = g.append('g')
      .selectAll('line')
      .data(edgesCopy, d => d.id)
      .enter()
      .append('line')
      .attr('stroke', d => {
        // Alarmed edges get red color
        if (alarmedEdgeIds.includes(d.id)) return '#E4002B'
        // Selected edges get magenta
        if (selectedEdgeId === d.id) return '#E20074'
        // Otherwise use utilization-based color
        return getEdgeColor(d)
      })
      .attr('stroke-width', d => {
        // Alarmed edges are thicker
        if (alarmedEdgeIds.includes(d.id)) return getEdgeThickness(d) + 2
        // Selected edges are slightly thicker
        if (selectedEdgeId === d.id) return getEdgeThickness(d) + 1
        // Normal edges use bandwidth-based thickness
        return getEdgeThickness(d)
      })
      .attr('opacity', d => {
        // Alarmed edges are more visible
        if (alarmedEdgeIds.includes(d.id)) return 0.9
        return 0.6
      })
      .attr('class', d => alarmedEdgeIds.includes(d.id) ? 'alarmed-edge' : '')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        onEdgeClick?.(d)
      })
      .on('mouseenter', (event, d) => {
        hoveredEdgeRef.current = d.id
        updateHoverState()
      })
      .on('mouseleave', () => {
        hoveredEdgeRef.current = null
        updateHoverState()
      })

    linkRef.current = link

    // Create node groups (for image + circle fallback)
    const nodeGroup = g.append('g')
      .selectAll('g')
      .data(nodesCopy, d => d.id)
      .enter()
      .append('g')
      .attr('class', d => alarmedNodeIds.includes(d.id) ? 'alarmed-node' : '')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeClick?.(d)
      })
      .on('mouseenter', (event, d) => {
        hoveredNodeRef.current = d.id
        updateHoverState()
      })
      .on('mouseleave', () => {
        hoveredNodeRef.current = null
        updateHoverState()
      })
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded))

    // Add circles (fallback when no image)
    nodeGroup.append('circle')
      .attr('r', d => {
        if (selectedNodeId === d.id) return 16
        if (alarmedNodeIds.includes(d.id)) return 14
        return 12
      })
      .attr('fill', d => NODE_TYPES[d.type]?.color || '#0066CC')
      .attr('opacity', d => nodeImages[d.id] ? 0 : 0.8)
      .attr('stroke', d => {
        if (selectedNodeId === d.id) return '#E20074'
        if (alarmedNodeIds.includes(d.id)) return '#E4002B'
        return 'white'
      })
      .attr('stroke-width', d => {
        if (selectedNodeId === d.id) return 3
        if (alarmedNodeIds.includes(d.id)) return 2
        return 1.5
      })

    // Add images for nodes that have them
    nodeGroup.append('image')
      .attr('xlink:href', d => nodeImages[d.id] || '')
      .attr('x', d => {
        const size = selectedNodeId === d.id ? 32 : alarmedNodeIds.includes(d.id) ? 28 : 24
        return -size / 2
      })
      .attr('y', d => {
        const size = selectedNodeId === d.id ? 32 : alarmedNodeIds.includes(d.id) ? 28 : 24
        return -size / 2
      })
      .attr('width', d => {
        if (selectedNodeId === d.id) return 32
        if (alarmedNodeIds.includes(d.id)) return 28
        return 24
      })
      .attr('height', d => {
        if (selectedNodeId === d.id) return 32
        if (alarmedNodeIds.includes(d.id)) return 28
        return 24
      })
      .attr('opacity', d => nodeImages[d.id] ? 1 : 0)
      .style('pointer-events', 'none')

    nodeRef.current = nodeGroup

    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodesCopy, d => d.id)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.8em')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('stroke', '#000')
      .attr('stroke-width', '2')
      .attr('paint-order', 'stroke')
      .attr('pointer-events', 'none')
      .attr('opacity', d => {
        if (selectedNodeId === d.id || hoveredNodeRef.current === d.id) return 1
        return 0
      })
      .text(d => d.name.split(' ')[0])

    labelsRef.current = labels

    // Function to update hover state
    const updateHoverState = () => {
      if (linkRef.current) {
        linkRef.current.attr('opacity', d => {
          if (hoveredEdgeRef.current === d.id) return 1
          if (alarmedEdgeIds.includes(d.id)) return 0.9
          if (hoveredNodeRef.current) return 0.3
          return 0.6
        })
      }

      if (nodeRef.current) {
        nodeRef.current.selectAll('circle').attr('opacity', d => {
          if (nodeImages[d.id]) return 0 // Hide circle if image exists
          if (hoveredNodeRef.current === d.id) return 1
          if (hoveredNodeRef.current) return 0.3
          return 0.8
        })
        
        nodeRef.current.selectAll('image').attr('opacity', d => {
          if (!nodeImages[d.id]) return 0
          if (hoveredNodeRef.current === d.id) return 1
          if (hoveredNodeRef.current) return 0.5
          return 1
        })
      }

      if (labelsRef.current) {
        labelsRef.current.attr('opacity', d => {
          if (hoveredNodeRef.current === d.id || selectedNodeId === d.id) return 1
          return 0
        })
      }
    }

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      nodeGroup
        .attr('transform', d => `translate(${d.x},${d.y})`)

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y)
    })

    // Drag functions
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [nodes, edges, dimensions, selectedNodeId, selectedEdgeId, alarmedNodeIds, alarmedEdgeIds, onNodeClick, onEdgeClick, layout, nodeImages])

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden relative">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: '#0a0a0a' }}
      />
      
      {/* CSS for alarm animations */}
      <style>{`
        .alarmed-edge {
          animation: pulse-edge 2s ease-in-out infinite;
        }
        
        .alarmed-node {
          animation: pulse-node 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse-edge {
          0%, 100% {
            opacity: 0.9;
            filter: drop-shadow(0 0 4px #E4002B);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 8px #E4002B);
          }
        }
        
        @keyframes pulse-node {
          0%, 100% {
            filter: drop-shadow(0 0 6px #E4002B);
          }
          50% {
            filter: drop-shadow(0 0 12px #E4002B);
          }
        }
      `}</style>
      
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
        <p>Drag to move • Scroll to zoom • Click nodes/edges for details</p>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/90 p-3 rounded-lg border border-border text-xs">
        <div className="font-semibold mb-2">Edge Utilization</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#00A651]"></div>
            <span>&lt; 40% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#FFB81C]"></div>
            <span>40-70% (Medium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-[#E4002B]"></div>
            <span>&gt; 70% (High)</span>
          </div>
        </div>
        <div className="font-semibold mt-3 mb-2">Edge Thickness</div>
        <div className="text-muted-foreground">Based on bandwidth</div>
      </div>
    </div>
  )
}

export default NetworkTopologyVisualizationEnhanced

