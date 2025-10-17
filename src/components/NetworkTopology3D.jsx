import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_TYPES } from '@/lib/networkDataset'

// Enhanced camera controls hook with keyboard, mouse, and presets
const useCameraControls = (targetPosition, animating) => {
  const { camera, gl } = useThree()
  const targetRef = useRef(new THREE.Vector3(0, 0, 0))
  const panOffset = useRef(new THREE.Vector3(0, 0, 0))

  React.useEffect(() => {
    let isDragging = false
    let isPanning = false
    let previousMousePosition = { x: 0, y: 0 }

    const handleMouseDown = (event) => {
      if (event.button === 0) { // Left click - rotate
        isDragging = true
      } else if (event.button === 2) { // Right click - pan
        isPanning = true
      }
      previousMousePosition = { x: event.clientX, y: event.clientY }
      event.preventDefault()
    }

    const handleMouseMove = (event) => {
      if (!isDragging && !isPanning) return

      const deltaX = event.clientX - previousMousePosition.x
      const deltaY = event.clientY - previousMousePosition.y

      if (isDragging) {
        // Rotate camera around target
        const spherical = new THREE.Spherical()
        spherical.setFromVector3(camera.position.clone().sub(targetRef.current))

        spherical.theta -= deltaX * 0.01
        spherical.phi += deltaY * 0.01

        // Clamp phi to avoid flipping
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))

        camera.position.setFromSpherical(spherical).add(targetRef.current)
        camera.lookAt(targetRef.current)
      } else if (isPanning) {
        // Pan camera
        const panSpeed = 0.02
        const offset = new THREE.Vector3(-deltaX * panSpeed, deltaY * panSpeed, 0)
        offset.applyQuaternion(camera.quaternion)

        panOffset.current.add(offset)
        targetRef.current.add(offset)
        camera.position.add(offset)
      }

      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDragging = false
      isPanning = false
    }

    const handleWheel = (event) => {
      event.preventDefault()
      const zoomSpeed = 0.1
      const direction = new THREE.Vector3().subVectors(camera.position, targetRef.current).normalize()
      const distance = camera.position.distanceTo(targetRef.current)

      const newDistance = Math.max(5, Math.min(100, distance + event.deltaY * zoomSpeed))
      camera.position.copy(targetRef.current).add(direction.multiplyScalar(newDistance))
    }

    const handleContextMenu = (event) => {
      event.preventDefault() // Prevent right-click menu
    }

    // Keyboard controls
    const handleKeyDown = (event) => {
      const moveSpeed = 0.5
      const rotateSpeed = 0.1

      switch(event.key.toLowerCase()) {
        // WASD movement
        case 'w':
          camera.position.z -= moveSpeed
          targetRef.current.z -= moveSpeed
          break
        case 's':
          camera.position.z += moveSpeed
          targetRef.current.z += moveSpeed
          break
        case 'a':
          camera.position.x -= moveSpeed
          targetRef.current.x -= moveSpeed
          break
        case 'd':
          camera.position.x += moveSpeed
          targetRef.current.x += moveSpeed
          break

        // Arrow keys - rotation
        case 'arrowleft':
          {
            const spherical = new THREE.Spherical()
            spherical.setFromVector3(camera.position.clone().sub(targetRef.current))
            spherical.theta -= rotateSpeed
            camera.position.setFromSpherical(spherical).add(targetRef.current)
            camera.lookAt(targetRef.current)
          }
          break
        case 'arrowright':
          {
            const spherical = new THREE.Spherical()
            spherical.setFromVector3(camera.position.clone().sub(targetRef.current))
            spherical.theta += rotateSpeed
            camera.position.setFromSpherical(spherical).add(targetRef.current)
            camera.lookAt(targetRef.current)
          }
          break
        case 'arrowup':
          {
            const spherical = new THREE.Spherical()
            spherical.setFromVector3(camera.position.clone().sub(targetRef.current))
            spherical.phi = Math.max(0.1, spherical.phi - rotateSpeed)
            camera.position.setFromSpherical(spherical).add(targetRef.current)
            camera.lookAt(targetRef.current)
          }
          break
        case 'arrowdown':
          {
            const spherical = new THREE.Spherical()
            spherical.setFromVector3(camera.position.clone().sub(targetRef.current))
            spherical.phi = Math.min(Math.PI - 0.1, spherical.phi + rotateSpeed)
            camera.position.setFromSpherical(spherical).add(targetRef.current)
            camera.lookAt(targetRef.current)
          }
          break

        // +/- zoom
        case '+':
        case '=':
          {
            const direction = new THREE.Vector3().subVectors(camera.position, targetRef.current).normalize()
            const distance = camera.position.distanceTo(targetRef.current)
            const newDistance = Math.max(5, distance - 2)
            camera.position.copy(targetRef.current).add(direction.multiplyScalar(newDistance))
          }
          break
        case '-':
        case '_':
          {
            const direction = new THREE.Vector3().subVectors(camera.position, targetRef.current).normalize()
            const distance = camera.position.distanceTo(targetRef.current)
            const newDistance = Math.min(100, distance + 2)
            camera.position.copy(targetRef.current).add(direction.multiplyScalar(newDistance))
          }
          break
      }
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('mouseup', handleMouseUp)
    gl.domElement.addEventListener('wheel', handleWheel)
    gl.domElement.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('mouseup', handleMouseUp)
      gl.domElement.removeEventListener('wheel', handleWheel)
      gl.domElement.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [camera, gl])

  // Smooth camera animation to target position
  useFrame(() => {
    if (animating && targetPosition) {
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(targetRef.current)
    }
  })

  return { targetRef, panOffset }
}

// Convert lat/lon to 3D coordinates on a sphere - LARGER RADIUS for better spread
const latLonToVector3 = (lat, lon, radius = 12) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

// Regional colors for cyberpunk theme
const REGION_COLORS = {
  Northeast: '#FF0080', // Hot pink
  West: '#00FFFF', // Cyan
  Midwest: '#FFFF00', // Yellow
  South: '#FF4500', // Orange red
  Pacific: '#8000FF', // Purple
  Southeast: '#00FF00' // Lime green
}

// Node component with glowing effect and selection
const NetworkNode = ({ node, onHover, onLeave, onClick, isSelected }) => {
  const meshRef = useRef()
  const glowRef = useRef()
  const ringRef = useRef()

  const position = useMemo(() => latLonToVector3(node.location.lat, node.location.lon), [node.location])

  const nodeColor = NODE_TYPES[node.type]?.color || '#FFFFFF'
  const regionColor = REGION_COLORS[node.region] || '#FFFFFF'

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing animation
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9
      meshRef.current.scale.setScalar(pulse)
    }
    if (glowRef.current) {
      // Glow pulsing
      const glowPulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7
      glowRef.current.material.opacity = glowPulse * 0.6
    }
    if (ringRef.current && isSelected) {
      // Rotate selection ring
      ringRef.current.rotation.z += 0.02
    }
  })

  return (
    <group position={position}>
      {/* Main node sphere - metallic - LARGER */}
      <mesh
        ref={meshRef}
        onPointerOver={() => onHover(node)}
        onPointerOut={onLeave}
        onClick={() => onClick(node)}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing aura - LARGER */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color={regionColor}
          transparent
          opacity={0.6}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Selection ring - LARGER */}
      {isSelected && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.04, 8, 32]} />
          <meshBasicMaterial
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  )
}

// Connection line component with pulsating effect
const NetworkConnection = ({ edge, nodes }) => {
  const lineRef = useRef()

  const sourceNode = nodes.find(n => n.id === edge.source)
  const targetNode = nodes.find(n => n.id === edge.target)

  const geometry = useMemo(() => {
    if (!sourceNode || !targetNode) return null

    const start = latLonToVector3(sourceNode.location.lat, sourceNode.location.lon)
    const end = latLonToVector3(targetNode.location.lat, targetNode.location.lon)

    const points = [start, end]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [sourceNode, targetNode])

  useFrame((state) => {
    if (lineRef.current) {
      // Pulsating opacity animation
      const pulse = Math.sin(state.clock.elapsedTime * 4 + Math.random() * Math.PI) * 0.3 + 0.7
      lineRef.current.material.opacity = pulse
    }
  })

  if (!geometry) return null

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00FFFF"
        transparent
        opacity={0.8}
      />
    </line>
  )
}

// Data flow effect - simplified pulsing connections - LARGER
const DataFlowEffect = ({ edges, nodes }) => {
  return (
    <group>
      {edges.slice(0, 10).map((edge) => { // Limit for performance
        const sourceNode = nodes.find(n => n.id === edge.source)
        const targetNode = nodes.find(n => n.id === edge.target)
        if (!sourceNode || !targetNode) return null

        const start = latLonToVector3(sourceNode.location.lat, sourceNode.location.lon)
        const end = latLonToVector3(targetNode.location.lat, targetNode.location.lon)
        const midPoint = start.clone().lerp(end, 0.5)

        return (
          <mesh key={`flow-${edge.id}`} position={midPoint}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial
              color="#FFFF00"
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Camera preset positions - Optimized for larger sphere
const CAMERA_PRESETS = {
  default: { position: new THREE.Vector3(0, 0, 18), name: 'Default' },
  top: { position: new THREE.Vector3(0, 25, 0), name: 'Top View' },
  front: { position: new THREE.Vector3(0, 0, 25), name: 'Front View' },
  side: { position: new THREE.Vector3(25, 0, 0), name: 'Side View' },
  dynamic: { position: new THREE.Vector3(15, 15, 15), name: 'Dynamic' }
}

// Scene component that renders inside Canvas
const Scene = ({ nodes, edges, onNodeHover, onNodeLeave, onNodeClick, selectedNodeId, cameraTarget, isAnimating }) => {
  // Use custom camera controls inside Canvas
  useCameraControls(cameraTarget, isAnimating)

  return (
    <>
      {/* Enhanced multi-point lighting system */}
      <ambientLight intensity={0.3} />
      <hemisphereLight intensity={0.2} groundColor="#000000" />
      <directionalLight position={[10, 10, 10]} intensity={0.5} color="#FFFFFF" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00FFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FF0080" />
      <pointLight position={[0, 15, 0]} intensity={0.4} color="#FFFF00" />
      <spotLight position={[0, 20, 0]} angle={0.3} intensity={0.5} color="#FFFFFF" />

      {/* Render connections first (behind nodes) */}
      {edges.map(edge => (
        <NetworkConnection
          key={edge.id}
          edge={edge}
          nodes={nodes}
        />
      ))}

      {/* Render nodes */}
      {nodes.map(node => (
        <NetworkNode
          key={node.id}
          node={node}
          onHover={onNodeHover}
          onLeave={onNodeLeave}
          onClick={onNodeClick}
          isSelected={node.id === selectedNodeId}
        />
      ))}

      {/* Data flow effect */}
      <DataFlowEffect edges={edges} nodes={nodes} />
    </>
  )
}

// Main 3D Network Topology Component
const NetworkTopology3D = ({ nodes, edges }) => {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [cameraTarget, setCameraTarget] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  const handleNodeHover = (node) => {
    setHoveredNode(node)
  }

  const handleNodeLeave = () => {
    setHoveredNode(null)
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
    // Animate camera to focus on selected node
    const nodePosition = latLonToVector3(node.location.lat, node.location.lon)
    const cameraPos = nodePosition.clone().add(new THREE.Vector3(2, 2, 2))
    setCameraTarget(cameraPos)
    setIsAnimating(true)

    setTimeout(() => {
      setIsAnimating(false)
      setCameraTarget(null)
    }, 1500)
  }

  const handleCameraPreset = (presetKey) => {
    const preset = CAMERA_PRESETS[presetKey]
    setCameraTarget(preset.position.clone())
    setIsAnimating(true)

    setTimeout(() => {
      setIsAnimating(false)
      setCameraTarget(null)
    }, 1500)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current?.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current?.msRequestFullscreen) {
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
  }

  // Listen for fullscreen changes
  React.useEffect(() => {
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

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 75 }}
        style={{ background: 'radial-gradient(circle, #0a0a0a 0%, #000000 100%)' }}
      >
        <Scene
          nodes={nodes}
          edges={edges}
          onNodeHover={handleNodeHover}
          onNodeLeave={handleNodeLeave}
          onNodeClick={handleNodeClick}
          selectedNodeId={selectedNode?.id}
          cameraTarget={cameraTarget}
          isAnimating={isAnimating}
        />
      </Canvas>

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
      <div className="absolute top-4 left-4 bg-black/90 border border-cyan-400 p-4 rounded-lg text-white font-mono text-xs max-w-xs">
        <h3 className="text-cyan-400 font-bold mb-3">3D CONTROLS</h3>
        <div className="space-y-2 mb-4 text-gray-300">
          <p>🖱️ Left-drag: Rotate</p>
          <p>🖱️ Right-drag: Pan</p>
          <p>🖱️ Scroll: Zoom</p>
          <p>⌨️ WASD: Move camera</p>
          <p>⌨️ Arrows: Rotate view</p>
          <p>⌨️ +/- : Zoom in/out</p>
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
        <div className="absolute top-4 right-4 bg-black/90 border border-cyan-400 p-4 rounded-lg text-white font-mono text-sm max-w-xs">
          <h3 className="text-cyan-400 font-bold mb-2">{hoveredNode.name}</h3>
          <div className="space-y-1">
            <p><span className="text-gray-400">Type:</span> {NODE_TYPES[hoveredNode.type]?.label}</p>
            <p><span className="text-gray-400">Region:</span> {hoveredNode.region}</p>
            <p><span className="text-gray-400">Status:</span> <span className="text-green-400">{hoveredNode.status}</span></p>
            <p><span className="text-gray-400">Capacity:</span> {hoveredNode.capacity?.toLocaleString()}</p>
            <p><span className="text-gray-400">Location:</span> {hoveredNode.location.city}</p>
          </div>
        </div>
      )}

      {/* Selection Panel - Bottom Left */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-black/90 border border-pink-400 p-4 rounded-lg text-white font-mono text-sm max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-pink-400 font-bold">SELECTED NODE</h3>
            <button
              onClick={() => setSelectedNode(null)}
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
            <p><span className="text-gray-400">Location:</span> {selectedNode.location.city}, {selectedNode.location.state}</p>
            <p><span className="text-gray-400">Coordinates:</span> {selectedNode.location.lat.toFixed(2)}, {selectedNode.location.lon.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Stats Overlay - Bottom Right */}
      <div className="absolute bottom-4 right-4 bg-black/80 border border-pink-400 p-3 rounded text-white font-mono text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>NODES: {nodes.length}</div>
          <div>EDGES: {edges.length}</div>
          <div>REGIONS: {new Set(nodes.map(n => n.region)).size}</div>
          <div>ACTIVE: {nodes.filter(n => n.status === 'operational').length}</div>
        </div>
      </div>

      {/* Camera Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="bg-black/70 border border-yellow-400 px-3 py-1 rounded-full text-yellow-400 font-mono text-xs">
          🎮 Interactive 3D View
        </div>
      </div>
    </div>
  )
}

export default NetworkTopology3D