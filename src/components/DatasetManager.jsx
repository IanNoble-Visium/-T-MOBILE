import { useState, useRef } from 'react'
import { Download, Upload, RotateCcw, AlertCircle, CheckCircle, Database, Loader } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * DatasetManager Component
 * Handles uploading, downloading, and managing network topology datasets
 */
const DatasetManager = ({ dataset, onImport, onReset, onExport, onSyncToNeo4j, onLoadFromNeo4j }) => {
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success') // 'success' or 'error'
  const [syncing, setSyncing] = useState(false)
  const fileInputRef = useRef(null)

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result
        if (typeof content !== 'string') {
          showMessage('Failed to read file', 'error')
          return
        }

        const success = onImport(content)
        if (success) {
          showMessage(`Dataset imported successfully! (${JSON.parse(content).nodes.length} nodes, ${JSON.parse(content).edges.length} edges)`)
        } else {
          showMessage('Failed to import dataset. Please check the JSON format.', 'error')
        }
      } catch (err) {
        showMessage(`Error: ${err.message}`, 'error')
      }
    }
    reader.onerror = () => {
      showMessage('Failed to read file', 'error')
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = () => {
    try {
      const json = onExport()
      if (!json) {
        showMessage('No dataset to export', 'error')
        return
      }

      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tmobile-network-dataset-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showMessage('Dataset exported successfully!')
    } catch (err) {
      showMessage(`Export error: ${err.message}`, 'error')
    }
  }

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the dataset to default? This cannot be undone.')) {
      setSyncing(true)
      try {
        await onReset()
        showMessage('Dataset reset to default')
      } catch (err) {
        showMessage(`Reset error: ${err.message}`, 'error')
      } finally {
        setSyncing(false)
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSyncToNeo4j = async () => {
    setSyncing(true)
    try {
      const success = await onSyncToNeo4j()
      if (success) {
        showMessage('Dataset synced to Neo4j successfully!')
      } else {
        showMessage('Failed to sync dataset to Neo4j', 'error')
      }
    } catch (err) {
      showMessage(`Sync error: ${err.message}`, 'error')
    } finally {
      setSyncing(false)
    }
  }

  const handleLoadFromNeo4j = async () => {
    setSyncing(true)
    try {
      const success = await onLoadFromNeo4j()
      if (success) {
        showMessage('Dataset loaded from Neo4j successfully!')
      } else {
        showMessage('Failed to load dataset from Neo4j', 'error')
      }
    } catch (err) {
      showMessage(`Load error: ${err.message}`, 'error')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Message Alert */}
      {message && (
        <Alert variant={messageType === 'error' ? 'destructive' : 'default'}>
          <div className="flex items-center gap-2">
            {messageType === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Dataset Info */}
      {dataset && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-3">Dataset Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Nodes</p>
              <p className="text-lg font-bold text-primary">{dataset.nodes?.length || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Edges</p>
              <p className="text-lg font-bold text-primary">{dataset.edges?.length || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Version</p>
              <p className="text-lg font-bold">{dataset.metadata?.version || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="text-xs font-mono">
                {dataset.metadata?.last_updated 
                  ? new Date(dataset.metadata.last_updated).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Dataset
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Download Dataset
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>

      {/* Neo4j Sync Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border pt-4">
        {/* Sync to Neo4j Button */}
        <button
          onClick={handleSyncToNeo4j}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Database className="w-4 h-4" />
          )}
          {syncing ? 'Syncing...' : 'Sync to Neo4j'}
        </button>

        {/* Load from Neo4j Button */}
        <button
          onClick={handleLoadFromNeo4j}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Database className="w-4 h-4" />
          )}
          {syncing ? 'Loading...' : 'Load from Neo4j'}
        </button>
      </div>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload dataset JSON file"
      />

      {/* Instructions */}
      <div className="bg-background rounded-lg border border-border p-4 text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Dataset Management Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Upload:</strong> Import a custom network topology JSON file</li>
          <li><strong>Download:</strong> Export the current dataset as JSON</li>
          <li><strong>Reset:</strong> Restore the default T-Mobile network topology</li>
          <li><strong>Sync to Neo4j:</strong> Save the current dataset to Neo4j Aura database</li>
          <li><strong>Load from Neo4j:</strong> Load dataset from Neo4j Aura database</li>
          <li>Datasets are automatically saved to browser storage and Neo4j</li>
          <li>JSON must include nodes array, edges array, and metadata object</li>
        </ul>
      </div>
    </div>
  )
}

export default DatasetManager

