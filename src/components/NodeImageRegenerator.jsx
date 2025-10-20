import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

const DEVICE_TYPES = [
  { value: 'router', label: 'Router' },
  { value: 'switch', label: 'Switch' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'server', label: 'Server' },
  { value: 'data_center', label: 'Data Center' },
  { value: 'endpoint', label: 'Endpoint' },
  { value: 'gateway', label: 'Gateway' },
  { value: 'load_balancer', label: 'Load Balancer' },
  { value: 'access_point', label: 'Access Point' },
];

const STYLE_OPTIONS = [
  { value: 'digital_illustration', label: 'Digital Illustration (Default)' },
  { value: 'realistic_image', label: 'Realistic Image' },
  { value: 'vector_illustration', label: 'Vector Illustration' },
  { value: 'icon', label: 'Icon Style' },
];

const TYPE_PROMPTS = {
  router: 'high-resolution icon of a modern network router with clean lines, professional tech style, minimalist design',
  switch: 'high-resolution icon of a network switch with multiple ports, professional tech style, minimalist design',
  firewall: 'high-resolution icon of a security firewall with shield symbol, professional tech style, minimalist design',
  server: 'high-resolution icon of a modern server rack, professional tech style, minimalist design',
  data_center: 'modern data center building with glass facade and server infrastructure, professional architectural visualization',
  endpoint: 'high-resolution icon of a computer workstation, professional tech style, minimalist design',
  gateway: 'high-resolution icon of a network gateway device, professional tech style, minimalist design',
  load_balancer: 'high-resolution icon of a load balancer with distribution arrows, professional tech style, minimalist design',
  access_point: 'high-resolution icon of a wireless access point with signal waves, professional tech style, minimalist design',
};

/**
 * NodeImageRegenerator Component
 * Allows regenerating individual node images with custom prompts and options
 */
export default function NodeImageRegenerator({ 
  node, 
  currentImageUrl,
  isOpen, 
  onClose, 
  onRegenerate 
}) {
  const [deviceType, setDeviceType] = useState(node?.type || 'router');
  const [style, setStyle] = useState('digital_illustration');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [fullPrompt, setFullPrompt] = useState('');

  // Update full prompt preview when inputs change
  useEffect(() => {
    if (!node) return;

    const basePrompt = TYPE_PROMPTS[deviceType] || TYPE_PROMPTS.router;
    const nodeNamePart = `for T-Mobile network device: ${node.name}`;
    const customPart = customPrompt.trim() ? ` ${customPrompt.trim()}` : '';
    
    setFullPrompt(`Create ${basePrompt} ${nodeNamePart}${customPart}`);
  }, [deviceType, customPrompt, node]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen && node) {
      setDeviceType(node.type || 'router');
      setStyle('digital_illustration');
      setCustomPrompt('');
      setError(null);
    }
  }, [isOpen, node]);

  const handleRegenerate = async () => {
    if (!node) return;

    setIsRegenerating(true);
    setError(null);

    try {
      await onRegenerate({
        node,
        deviceType,
        style,
        customPrompt: customPrompt.trim(),
        fullPrompt,
      });
      onClose();
    } catch (err) {
      console.error('Error regenerating node image:', err);
      setError(err.message || 'Failed to regenerate image. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!node) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#E20074]" />
            Regenerate Node Image
          </DialogTitle>
          <DialogDescription>
            Customize and regenerate the AI-generated image for <strong>{node.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Image Preview */}
          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="border border-border rounded-lg p-4 bg-background flex items-center justify-center h-48">
              {currentImageUrl ? (
                <img 
                  src={currentImageUrl} 
                  alt={node.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <ImageIcon className="h-12 w-12" />
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Device Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="device-type">Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger id="device-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the type of device to generate the appropriate base prompt
            </p>
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <Label htmlFor="style">AI Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the visual style for the generated image
            </p>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Custom Prompt (Optional)</Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add custom details to enhance the prompt (e.g., 'with magenta lighting and glass facade')"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Add specific details to customize the generated image
            </p>
          </div>

          {/* Full Prompt Preview */}
          <div className="space-y-2">
            <Label>Full Prompt Preview</Label>
            <div className="border border-border rounded-lg p-3 bg-muted/50 text-sm">
              <p className="text-foreground/80 italic">{fullPrompt}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              This is the complete prompt that will be sent to Recraft AI
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isRegenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="bg-[#E20074] hover:bg-[#E20074]/90"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Image
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

