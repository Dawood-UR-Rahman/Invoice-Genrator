import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
}

interface ContentSectionProps {
  onContentChange?: (content: ContentSectionData) => void;
}

export interface ContentSectionData {
  title: string;
  description: string;
  mediaItems: MediaItem[];
}

export default function ContentSection({ onContentChange }: ContentSectionProps) {
  const { toast } = useToast();
  const [content, setContent] = useState<ContentSectionData>({
    title: "",
    description: "",
    mediaItems: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentUpdate = (field: keyof ContentSectionData, value: any) => {
    const updatedContent = { ...content, [field]: value };
    setContent(updatedContent);
    onContentChange?.(updatedContent);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        
        const newMediaItem: MediaItem = {
          id: `media-${Date.now()}-${Math.random()}`,
          type: mediaType,
          url: result,
          title: file.name,
          description: `${mediaType} uploaded on ${new Date().toLocaleDateString()}`
        };

        const updatedMediaItems = [...content.mediaItems, newMediaItem];
        handleContentUpdate('mediaItems', updatedMediaItems);
        
        toast({
          title: "Media uploaded successfully",
          description: `${file.name} has been added to your content section.`,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMediaItem = (id: string) => {
    const updatedMediaItems = content.mediaItems.filter(item => item.id !== id);
    handleContentUpdate('mediaItems', updatedMediaItems);
    
    toast({
      title: "Media removed",
      description: "Media item has been removed from your content section.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-photo-video text-primary"></i>
          Content & Media Section
        </CardTitle>
        <p className="text-sm text-gray-600">
          Add images, videos, and rich content to enhance your invoice presentation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title & Description */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="content-title">Content Title</Label>
            <Input
              id="content-title"
              value={content.title}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              placeholder="e.g., Project Gallery, Work Samples, etc."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="content-description">Description</Label>
            <Textarea
              id="content-description"
              value={content.description}
              onChange={(e) => handleContentUpdate('description', e.target.value)}
              placeholder="Describe what this content represents..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Media Files</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <i className="fas fa-cloud-upload-alt"></i>
              Upload Media
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {/* Media Grid */}
          {content.mediaItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.mediaItems.map((item) => (
                <div key={item.id} className="relative group">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-32 object-cover"
                          controls
                        />
                      )}
                      <div className="p-3">
                        <h4 className="text-sm font-medium truncate">{item.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                    onClick={() => removeMediaItem(item.id)}
                  >
                    <i className="fas fa-times text-xs"></i>
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {content.mediaItems.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <i className="fas fa-photo-video text-3xl text-gray-400 mb-3"></i>
              <p className="text-gray-500 mb-2">No media files uploaded yet</p>
              <p className="text-sm text-gray-400">
                Support for images and videos (JPEG, PNG, MP4, etc.)
              </p>
            </div>
          )}
        </div>

        {/* Content Preview */}
        {(content.title || content.description || content.mediaItems.length > 0) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {content.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
              )}
              {content.description && (
                <p className="text-gray-600 mb-3">{content.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {content.mediaItems.length} media item{content.mediaItems.length !== 1 ? 's' : ''} attached
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}