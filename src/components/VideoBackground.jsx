import { useEffect, useState } from 'react'

const VideoBackground = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  // Array of all videos from the videos directory
  const videos = [
    'Video 01 - Hero Background Loop - A_cinematic_abstract_202510162341_qqzrv.mp4',
    'Video 02 - Threat Detection Visualization - Closeup_view_of_202510162341_g84t8.mp4',
    'Video 03 - 5G Network Visualization  - Aerial_view_of_202510162341_0ixni.mp4',
    'Video 04 - Graph Analytics Visualization  - 3d_visualization_of_202510162341_d5wxy.mp4',
    'Video 05 - Cyber Defense Center Operations - Cinematic_view_of_202510162342_93d8d.mp4',
    'Video 06 - IoT Device Security  - Splitscreen_visualization_showing_2025101623.mp4',
    'Video 07 - SASE Platform Overview - Abstract_visualization_of_202510162342_y0s71.mp4',
    'Video 08 - Competitive Advantage Visualization - Sidebyside_comparison_visualization_202510.mp4',
    'Video 09 - Platform Integration - Abstract_visualization_of_202510162352_c3efe.mp4',
    'Video 10 - SuccessROI Visualization  - Clean_professional_infographicstyle_2025101.mp4',
    'Video_1_short_202510170001_8z6su.mp4',
    'Video_2_short_202510170001_ck6pt.mp4',
    'Video_3_short_202510170001_bp2ai.mp4',
    'Video_4_short_202510170001_nzsir.mp4',
    'Video_5_short_202510170001_zijy3.mp4',
  ]

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setFadeOut(true)
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
        setFadeOut(false)
      }, 500)
    }, 10000) // Rotate every 10 seconds

    return () => clearInterval(rotationInterval)
  }, [videos.length])

  const currentVideo = videos[currentVideoIndex]

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Video Container with fade effect */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <video
          key={currentVideoIndex}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          src={`/videos/${currentVideo}`}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  )
}

export default VideoBackground
