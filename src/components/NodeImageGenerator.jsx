import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  batchGenerateNodeImages, 
  checkConfiguration,
  getCacheStats,
  clearImageCache
} from '@/lib/nodeImageManager'
import { Sparkles, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * NodeImageGenerator Component
 * Provides UI for generating SVG images for network nodes
 */
const NodeImageGenerator = ({ nodes, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [results, setResults] = useState(null)
  const [config, setConfig] = useState(checkConfiguration())
  const [cacheStats, setCacheStats] = useState(getCacheStats())

  const handleOpen = () => {
    setConfig(checkConfiguration())
    setCacheStats(getCacheStats())
    setIsOpen(true)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress({ current: 0, total: nodes.length })
    setResults(null)

    try {
      const generatedImages = await batchGenerateNodeImages(
        nodes,
        (current, total) => {
          setProgress({ current, total })
        }
      )

      setResults(generatedImages)
      setCacheStats(getCacheStats())
      
      if (onComplete) {
        onComplete(generatedImages)
      }
    } catch (error) {
      console.error('Error generating images:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached node images?')) {
      clearImageCache()
      setCacheStats(getCacheStats())
    }
  }

  const progressPercentage = progress.total > 0 
    ? (progress.current / progress.total) * 100 
    : 0

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Node Images
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E20074]" />
              Node Image Generator
            </DialogTitle>
            <DialogDescription>
              Generate high-resolution SVG images for network devices using Recraft AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Configuration Status */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Configuration Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {config.recraft ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Recraft API: {config.recraft ? 'Connected' : 'Not Configured'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {config.cloudinary ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Cloudinary: {config.cloudinary ? 'Connected' : 'Not Configured'}</span>
                </div>
              </div>
              {!config.ready && (
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Both Recraft and Cloudinary must be configured to generate images.
                  Check your environment variables.
                </p>
              )}
            </div>

            {/* Cache Statistics */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Image Cache</h4>
                <Button
                  onClick={handleClearCache}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={cacheStats.size === 0}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear Cache
                </Button>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Cached Images: </span>
                <span className="font-semibold">{cacheStats.size}</span>
              </div>
            </div>

            {/* Node Information */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Nodes to Process</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">Total Nodes: </span>
                  <span className="font-semibold">{nodes.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Already Cached: </span>
                  <span className="font-semibold">{cacheStats.size}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">To Generate: </span>
                  <span className="font-semibold">{Math.max(0, nodes.length - cacheStats.size)}</span>
                </div>
              </div>
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating images...</span>
                  <span className="font-semibold">{progress.current} / {progress.total}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {/* Results */}
            {results && !isGenerating && (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-green-500 mb-1">Generation Complete!</p>
                    <p className="text-muted-foreground">
                      Successfully generated {Object.keys(results).length} images.
                      The topology will now display SVG icons for network devices.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Information */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Images are generated based on node names and types</p>
              <p>• Generated images are cached for future use</p>
              <p>• This process may take a few minutes for large networks</p>
              <p>• Images are stored in Cloudinary for persistent access</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              disabled={isGenerating}
            >
              Close
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!config.ready || isGenerating}
              className="bg-[#E20074] hover:bg-[#E20074]/90"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Images
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NodeImageGenerator

