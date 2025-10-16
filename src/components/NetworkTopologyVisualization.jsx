import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { NODE_TYPES, EDGE_TYPES } from '@/lib/networkDataset'
import { LAYOUT_OPTIONS } from '@/lib/graphLayouts'

/**
 * NetworkTopologyVisualization Component
 * Renders an interactive D3-based network topology graph with multiple layout options
 */
const NetworkTopologyVisualization = ({
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
  const hoveredNodeRef = useRef(null)
  const hoveredEdgeRef = useRef(null)
  const linkRef = useRef(null)
  const nodeRef = useRef(null)
  const labelsRef = useRef(null)

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

    // Add zoom behavior
    const g = svg.append('g')
    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform)
    })
    svg.call(zoom)

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(edgesCopy, d => d.id)
      .enter()
      .append('line')
      .attr('stroke', d => {
        if (alarmedEdgeIds.includes(d.id)) return '#E4002B'
        if (selectedEdgeId === d.id) return '#E20074'
        return '#999'
      })
      .attr('stroke-width', d => {
        if (alarmedEdgeIds.includes(d.id)) return 3
        if (selectedEdgeId === d.id) return 2.5
        return 2
      })
      .attr('opacity', 0.6)
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

    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodesCopy, d => d.id)
      .enter()
      .append('circle')
      .attr('r', d => {
        if (selectedNodeId === d.id) return 12
        if (alarmedNodeIds.includes(d.id)) return 10
        return 8
      })
      .attr('fill', d => NODE_TYPES[d.type]?.color || '#0066CC')
      .attr('opacity', 0.8)
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

    nodeRef.current = node

    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodesCopy, d => d.id)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('font-size', '11px')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => d.name.split(' ')[0])

    labelsRef.current = labels

    // Function to update hover state
    const updateHoverState = () => {
      if (linkRef.current) {
        linkRef.current.attr('opacity', d => {
          if (hoveredEdgeRef.current === d.id) return 1
          if (hoveredNodeRef.current) return 0.3
          return 0.6
        })
      }

      if (nodeRef.current) {
        nodeRef.current.attr('opacity', d => {
          if (hoveredNodeRef.current === d.id) return 1
          if (hoveredNodeRef.current) return 0.3
          return 0.8
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

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

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
  }, [nodes, edges, dimensions, selectedNodeId, selectedEdgeId, alarmedNodeIds, alarmedEdgeIds, onNodeClick, onEdgeClick, layout])

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: '#0a0a0a' }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
        <p>Drag to move • Scroll to zoom • Click nodes/edges for details</p>
      </div>
    </div>
  )
}

export default NetworkTopologyVisualization

