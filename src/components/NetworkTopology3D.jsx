import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_TYPES } from '@/lib/networkDataset'

// Simple camera controls hook
const useCameraControls = () => {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  React.useEffect(() => {
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const handleMouseDown = (event) => {
      isDragging = true
      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event) => {
      if (!isDragging) return

      const deltaX = event.clientX - previousMousePosition.x
      const deltaY = event.clientY - previousMousePosition.y

      // Rotate camera around target
      const spherical = new THREE.Spherical()
      spherical.setFromVector3(camera.position)

      spherical.theta -= deltaX * 0.01
      spherical.phi += deltaY * 0.01

      // Clamp phi to avoid flipping
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))

      camera.position.setFromSpherical(spherical)
      camera.lookAt(0, 0, 0)

      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleWheel = (event) => {
      event.preventDefault()
      const zoomSpeed = 0.1
      const direction = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0, 0)).normalize()
      const distance = camera.position.length()

      const newDistance = Math.max(5, Math.min(50, distance + event.deltaY * zoomSpeed))
      camera.position.copy(direction.multiplyScalar(newDistance))
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('mouseup', handleMouseUp)
    gl.domElement.addEventListener('wheel', handleWheel)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('mouseup', handleMouseUp)
      gl.domElement.removeEventListener('wheel', handleWheel)
    }
  }, [camera, gl])

  return controlsRef
}

// Convert lat/lon to 3D coordinates on a sphere
const latLonToVector3 = (lat, lon, radius = 10) => {
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

// Node component with glowing effect
const NetworkNode = ({ node, onHover, onLeave }) => {
  const meshRef = useRef()
  const glowRef = useRef()

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
  })

  return (
    <group position={position}>
      {/* Main node sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => onHover(node)}
        onPointerOut={onLeave}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>

      {/* Glowing aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          color={regionColor}
          transparent
          opacity={0.6}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Node label - simplified without Html */}
      {/* Labels removed for performance - shown on hover instead */}
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

// Data flow effect - simplified pulsing connections
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
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color="#FFFF00"
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Scene component that renders inside Canvas
const Scene = ({ nodes, edges, hoveredNode, onNodeHover, onNodeLeave }) => {
  // Use custom camera controls inside Canvas
  useCameraControls()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00FFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FF0080" />

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

  const handleNodeHover = (node) => {
    setHoveredNode(node)
  }

  const handleNodeLeave = () => {
    setHoveredNode(null)
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ background: 'radial-gradient(circle, #0a0a0a 0%, #000000 100%)' }}
      >
        <Scene
          nodes={nodes}
          edges={edges}
          hoveredNode={hoveredNode}
          onNodeHover={handleNodeHover}
          onNodeLeave={handleNodeLeave}
        />
      </Canvas>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-black/90 border border-cyan-400 p-4 rounded-lg text-white font-mono text-sm max-w-xs">
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

      {/* Stats overlay */}
      <div className="absolute bottom-4 right-4 bg-black/80 border border-pink-400 p-3 rounded text-white font-mono text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>NODES: {nodes.length}</div>
          <div>EDGES: {edges.length}</div>
          <div>REGIONS: {new Set(nodes.map(n => n.region)).size}</div>
          <div>ACTIVE: {nodes.filter(n => n.status === 'operational').length}</div>
        </div>
      </div>
    </div>
  )
}

export default NetworkTopology3D