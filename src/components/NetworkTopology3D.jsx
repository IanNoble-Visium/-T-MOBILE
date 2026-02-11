import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { NODE_TYPES } from '@/lib/networkDataset'
import { getNodeImage } from '@/lib/nodeImageManager'
import * as THREE from 'three'

// Regional colors for cyberpunk theme
const REGION_COLORS = {
  Northeast: '#FF0080', // Hot pink
  West: '#00FFFF', // Cyan
  Midwest: '#FFFF00', // Yellow
  South: '#FF4500', // Orange red
  Pacific: '#8000FF', // Purple
  Southeast: '#00FF00' // Lime green
}

// Camera preset positions
const CAMERA_PRESETS = {
  default: { position: { x: 0, y: 0, z: 200 }, name: 'Default' },
  top: { position: { x: 0, y: 300, z: 0 }, name: 'Top View' },
  front: { position: { x: 0, y: 0, z: 300 }, name: 'Front View' },
  side: { position: { x: 300, y: 0, z: 0 }, name: 'Side View' },
  dynamic: { position: { x: 200, y: 200, z: 200 }, name: 'Dynamic' }
}

/**
 * Enhanced 3D Network Topology Component using 3d-force-graph
 * Provides superior performance and visual quality compared to custom Three.js implementation
 */
const NetworkTopology3D = ({ nodes, edges, onNodeClick, onNodeHover, onNodeLeave, selectedNodeId, alarmedNodeIds = [] }) => {
  const fgRef = useRef()
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showIcons, setShowIcons] = useState(false)
  const [nodeImages, setNodeImages] = useState({})
  const [iconsLoading, setIconsLoading] = useState(false)
  const containerRef = useRef(null)
  const textureCache = useRef(new Map())
  const textureLoader = useRef(new THREE.TextureLoader())

  // Load node images when icon mode is enabled
  useEffect(() => {
    if (!showIcons) return

    const loadImages = async () => {
      setIconsLoading(true)
      const images = {}

      for (const node of nodes) {
        try {
          const imageUrl = await getNodeImage(node, false)
          if (imageUrl) {
            images[node.id] = imageUrl
          }
        } catch (error) {
          console.error(`Error loading image for node ${node.id}:`, error)
        }
      }

      console.log(`Loaded ${Object.keys(images).length} node images for 3D view`)
      setNodeImages(images)
      setIconsLoading(false)
    }

    if (nodes.length > 0) {
      loadImages()
    }
  }, [nodes, showIcons])

  // Transform nodes and edges to 3d-force-graph format
  const graphData = useMemo(() => {
    // Convert nodes - add visual properties
    const graphNodes = nodes.map(node => {
      const nodeColor = NODE_TYPES[node.type]?.color || '#FFFFFF'
      const regionColor = REGION_COLORS[node.region] || '#FFFFFF'
      const isAlarmed = alarmedNodeIds.includes(node.id)
      const isSelected = selectedNodeId === node.id

      return {
        id: node.id,
        name: node.name,
        type: node.type,
        region: node.region,
        status: node.status,
        capacity: node.capacity,
        location: node.location,
        // Visual properties
        color: isSelected ? '#E20074' : isAlarmed ? '#E4002B' : nodeColor,
        regionColor,
        val: Math.max(3, Math.min(15, (node.capacity || 1000) / 100)), // Node size based on capacity
        isAlarmed,
        isSelected
      }
    })

    // Convert edges - ensure source/target are node IDs
    const graphLinks = edges.map(edge => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target
      
      return {
        source: sourceId,
        target: targetId,
        id: edge.id,
        bandwidth: edge.bandwidth,
        latency: edge.latency,
        utilization: edge.utilization,
        // Visual properties
        color: edge.utilization > 70 ? '#E4002B' : edge.utilization > 40 ? '#FFB81C' : '#00A651',
        width: Math.max(1, Math.min(5, (edge.bandwidth || 10) / 20))
      }
    })

    return { nodes: graphNodes, links: graphLinks }
  }, [nodes, edges, alarmedNodeIds, selectedNodeId])

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node)
    if (onNodeClick) {
      onNodeClick(node)
    }
    
    // Focus camera on clicked node
    if (fgRef.current) {
      const distance = 100
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
      
      fgRef.current.cameraPosition(
        {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio
        },
        node,
        3000 // Animation duration
      )
    }
  }, [onNodeClick])

  // Handle node hover
  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node)
    if (onNodeHover) {
      onNodeHover(node)
    }
  }, [onNodeHover])

  // Handle node leave
  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null)
    if (onNodeLeave) {
      onNodeLeave()
    }
  }, [onNodeLeave])

  // Camera preset handler
  const handleCameraPreset = useCallback((presetKey) => {
    if (!fgRef.current) return
    
    const preset = CAMERA_PRESETS[presetKey]
    fgRef.current.cameraPosition(preset.position, { x: 0, y: 0, z: 0 }, 2000)
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }, [isFullscreen])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Custom node 3D object - enhanced sphere with glow, or icon sprite
  const nodeThreeObject = useCallback((node) => {
    const group = new THREE.Group()
    const nodeSize = node.val / 2
    const imageUrl = showIcons ? nodeImages[node.id] : null

    if (imageUrl) {
      // --- Icon sprite mode ---
      let texture = textureCache.current.get(imageUrl)
      if (!texture) {
        texture = textureLoader.current.load(imageUrl, () => {
          // Force re-render when texture loads
          if (fgRef.current) fgRef.current.refresh()
        })
        texture.colorSpace = THREE.SRGBColorSpace
        textureCache.current.set(imageUrl, texture)
      }

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      })
      const iconSprite = new THREE.Sprite(spriteMaterial)
      const spriteSize = nodeSize * 3
      iconSprite.scale.set(spriteSize, spriteSize, 1)
      group.add(iconSprite)

      // Subtle colored backing glow behind icon for visibility
      const backingMaterial = new THREE.SpriteMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.25,
        depthWrite: false
      })
      const backing = new THREE.Sprite(backingMaterial)
      backing.scale.set(spriteSize * 1.3, spriteSize * 1.3, 1)
      group.add(backing)
    } else {
      // --- Sphere mode (default) ---
      const geometry = new THREE.SphereGeometry(nodeSize, 16, 16)
      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      })
      const sphere = new THREE.Mesh(geometry, nodeMaterial)
      group.add(sphere)
    }

    // Glow effect for alarmed nodes (both modes)
    if (node.isAlarmed) {
      const glowSize = imageUrl ? nodeSize * 2 : nodeSize + 2
      const glowGeometry = new THREE.SphereGeometry(glowSize, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: '#E4002B',
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      group.add(glow)
    }

    // Selection ring (both modes)
    if (node.isSelected) {
      const ringRadius = imageUrl ? nodeSize * 1.8 : nodeSize + 3
      const ringGeometry = new THREE.TorusGeometry(ringRadius, 1, 8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: '#E20074',
        emissive: '#E20074',
        emissiveIntensity: 1
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2
      group.add(ring)
    }

    return group
  }, [showIcons, nodeImages])

  // Custom link styling
  const linkColor = useCallback((link) => link.color || '#00FFFF')
  const linkWidth = useCallback((link) => link.width || 1)

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(node) => `${node.name}\n${NODE_TYPES[node.type]?.label || node.type}\n${node.region}`}
        nodeColor={(node) => node.color}
        nodeVal={(node) => node.val}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={!showIcons}
        linkLabel={(link) => `${link.bandwidth || 'N/A'} Gbps | ${link.latency || 'N/A'}ms | ${link.utilization || 0}%`}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={0.6}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowColor={(link) => link.color}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onNodeDragEnd={(node) => {
          node.fx = node.x
          node.fy = node.y
          node.fz = node.z
        }}
        onBackgroundClick={() => {
          setSelectedNode(null)
          setHoveredNode(null)
        }}
        showNavInfo={false}
        backgroundColor="#000000"
        // Force-directed layout settings
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        // Camera settings
        cameraPosition={{ x: 0, y: 0, z: 200 }}
        // Performance optimizations
        numDimensions={3}
        d3AlphaDecay={0.0228}
        d3VelocityDecay={0.4}
        warmupTicks={0}
      />

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-black/90 border border-yellow-400 p-2 rounded-lg text-yellow-400 hover:bg-yellow-400/20 transition-colors z-10"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      {/* Control Panel - Top Left */}
      <div className="absolute top-4 left-4 bg-black/90 border border-cyan-400 p-4 rounded-lg text-white font-mono text-xs max-w-xs z-10">
        <h3 className="text-cyan-400 font-bold mb-3">3D CONTROLS</h3>
        <div className="space-y-2 mb-4 text-gray-300">
          <p>🖱️ Left-drag: Rotate</p>
          <p>🖱️ Right-drag: Pan</p>
          <p>🖱️ Scroll: Zoom</p>
          <p>🖱️ Drag node: Move</p>
          <p>🖱️ Click node: Select</p>
          <p>🖼️ Toggle: Icons / Spheres</p>
        </div>
        <div className="border-t border-cyan-400/30 pt-3 mb-3">
          <p className="text-cyan-400 font-bold mb-2">DISPLAY</p>
          <button
            onClick={() => setShowIcons(prev => !prev)}
            disabled={iconsLoading}
            className={`w-full px-2 py-1.5 border rounded text-[10px] font-bold transition-colors ${
              showIcons
                ? 'bg-pink-500/30 hover:bg-pink-500/50 border-pink-400/70 text-pink-300'
                : 'bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-400/50 text-cyan-300'
            } ${iconsLoading ? 'opacity-50 cursor-wait' : ''}`}
            title={showIcons ? 'Switch to colored spheres' : 'Switch to device type icons'}
          >
            {iconsLoading ? '⏳ Loading Icons...' : showIcons ? '🎨 Switch to Spheres' : '🖼️ Switch to Icons'}
          </button>
          {showIcons && Object.keys(nodeImages).length === 0 && !iconsLoading && (
            <p className="text-yellow-400/80 text-[9px] mt-1">No cached icons found. Generate via 2D Enhanced view first.</p>
          )}
        </div>
        <div className="border-t border-cyan-400/30 pt-3">
          <p className="text-cyan-400 font-bold mb-2">CAMERA PRESETS</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleCameraPreset(key)}
                className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 rounded text-[10px] transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Tooltip - Top Right */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 bg-black/90 border border-cyan-400 p-4 rounded-lg text-white font-mono text-sm max-w-xs z-10">
          <h3 className="text-cyan-400 font-bold mb-2">{hoveredNode.name}</h3>
          <div className="space-y-1">
            <p><span className="text-gray-400">Type:</span> {NODE_TYPES[hoveredNode.type]?.label}</p>
            <p><span className="text-gray-400">Region:</span> {hoveredNode.region}</p>
            <p><span className="text-gray-400">Status:</span> <span className="text-green-400">{hoveredNode.status}</span></p>
            <p><span className="text-gray-400">Capacity:</span> {hoveredNode.capacity?.toLocaleString()}</p>
            <p><span className="text-gray-400">Location:</span> {hoveredNode.location?.city}</p>
            {hoveredNode.isAlarmed && (
              <p className="text-red-400 font-semibold">⚠️ Active Alarms</p>
            )}
          </div>
        </div>
      )}

      {/* Selection Panel - Bottom Left */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-black/90 border border-pink-400 p-4 rounded-lg text-white font-mono text-sm max-w-sm z-10">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-pink-400 font-bold">SELECTED NODE</h3>
            <button
              onClick={() => {
                setSelectedNode(null)
                if (fgRef.current) {
                  fgRef.current.cameraPosition({ x: 0, y: 0, z: 200 }, { x: 0, y: 0, z: 0 }, 2000)
                }
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <h4 className="text-white font-bold mb-3">{selectedNode.name}</h4>
          <div className="space-y-2">
            <p><span className="text-gray-400">ID:</span> {selectedNode.id}</p>
            <p><span className="text-gray-400">Type:</span> {NODE_TYPES[selectedNode.type]?.label}</p>
            <p><span className="text-gray-400">Region:</span> {selectedNode.region}</p>
            <p><span className="text-gray-400">Status:</span> <span className="text-green-400">{selectedNode.status}</span></p>
            <p><span className="text-gray-400">Capacity:</span> {selectedNode.capacity?.toLocaleString()}</p>
            {selectedNode.location && (
              <>
                <p><span className="text-gray-400">Location:</span> {selectedNode.location.city}, {selectedNode.location.state}</p>
                <p><span className="text-gray-400">Coordinates:</span> {selectedNode.location.lat?.toFixed(2)}, {selectedNode.location.lon?.toFixed(2)}</p>
              </>
            )}
            {selectedNode.isAlarmed && (
              <p className="text-red-400 font-semibold">⚠️ Active Alarms</p>
            )}
          </div>
        </div>
      )}

      {/* Stats Overlay - Bottom Right */}
      <div className="absolute bottom-4 right-4 bg-black/80 border border-pink-400 p-3 rounded text-white font-mono text-xs z-10">
        <div className="grid grid-cols-2 gap-2">
          <div>NODES: {nodes.length}</div>
          <div>EDGES: {edges.length}</div>
          <div>REGIONS: {new Set(nodes.map(n => n.region)).size}</div>
          <div>ACTIVE: {nodes.filter(n => n.status === 'operational').length}</div>
        </div>
      </div>

      {/* Camera Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
        <div className="bg-black/70 border border-yellow-400 px-3 py-1 rounded-full text-yellow-400 font-mono text-xs">
          🎮 Interactive 3D View
        </div>
      </div>
    </div>
  )
}

export default NetworkTopology3D
