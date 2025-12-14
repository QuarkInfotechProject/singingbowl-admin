"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, GripVertical, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import AllImages from "@/components/ui/(media-select)/mediaSelect";

// Static gallery images for demo (will be replaced with API data)
interface GalleryImage {
    id: number;
    imageUrl: string;
    fileName: string;
}

const GalleryPage = () => {
    const { toast } = useToast();
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Handle image selection from media library
    const handleImageSelect = useCallback((imageUrl: string) => {
        // Extract ID from URL or generate a temporary one
        const tempId = Date.now();
        const newImage: GalleryImage = {
            id: tempId,
            imageUrl: imageUrl,
            fileName: imageUrl.split('/').pop() || `image-${tempId}`,
        };

        setGalleryImages((prev) => {
            // Prevent duplicates
            if (prev.some((img) => img.imageUrl === imageUrl)) {
                toast({
                    description: "This image is already in the gallery",
                    variant: "destructive",
                });
                return prev;
            }
            return [...prev, newImage];
        });

        toast({
            description: "Image added to gallery",
            className: "bg-green-500 text-white",
        });
    }, [toast]);

    // Handle image removal
    const handleRemoveImage = useCallback((id: number) => {
        setGalleryImages((prev) => prev.filter((img) => img.id !== id));
        toast({
            description: "Image removed from gallery",
        });
    }, [toast]);

    // Handle drag and drop reordering
    const handleDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;

        setGalleryImages((prev) => {
            const items = [...prev];
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination!.index, 0, reorderedItem);
            return items;
        });
    }, []);

    // Placeholder for future API save function
    const handleSaveGallery = async () => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call when ready
            // const response = await fetch('/api/gallery', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ images: galleryImages.map(img => img.id) }),
            // });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                description: "Gallery saved successfully",
                className: "bg-green-500 text-white",
            });
        } catch (error) {
            toast({
                description: "Failed to save gallery",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gallery</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Select images from the media library to display in the user-facing gallery.
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* AllImages component has its own Dialog - use it with a trigger */}
                    <AllImages
                        trigger={
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Images
                            </Button>
                        }
                        onSelect={handleImageSelect}
                        toUpdate="additional"
                        uploadedImages={galleryImages.map((img) => img.id.toString())}
                    />
                    <Button
                        variant="outline"
                        onClick={handleSaveGallery}
                        disabled={isLoading || galleryImages.length === 0}
                    >
                        {isLoading ? "Saving..." : "Save Gallery"}
                    </Button>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white rounded-lg border p-6 min-h-[500px]">
                {galleryImages.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                        <ImageIcon className="h-16 w-16 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">No images in gallery</h3>
                        <p className="text-sm mt-1">Click "Add Images" to select images from the media library</p>
                    </div>
                ) : (
                    // Gallery Images Grid with Drag and Drop
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="gallery" direction="horizontal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                                >
                                    {galleryImages.map((image, index) => (
                                        <Draggable
                                            key={image.id}
                                            draggableId={image.id.toString()}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`relative group rounded-lg overflow-hidden border-2 ${snapshot.isDragging
                                                        ? "border-purple-500 shadow-lg"
                                                        : "border-transparent hover:border-gray-200"
                                                        }`}
                                                >
                                                    {/* Drag Handle */}
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="absolute top-2 left-2 z-10 bg-white/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                                                    >
                                                        <GripVertical className="h-4 w-4 text-gray-600" />
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleRemoveImage(image.id)}
                                                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>

                                                    {/* Image */}
                                                    <div className="aspect-square bg-gray-100">
                                                        {image.imageUrl.endsWith('.mp4') ? (
                                                            <video
                                                                src={image.imageUrl}
                                                                className="w-full h-full object-cover"
                                                                muted
                                                                loop
                                                                autoPlay
                                                                playsInline
                                                            />
                                                        ) : (
                                                            <img
                                                                src={image.imageUrl}
                                                                alt={image.fileName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Image Info */}
                                                    <div className="p-2 bg-gray-50">
                                                        <p className="text-xs text-gray-600 truncate" title={image.fileName}>
                                                            {image.fileName}
                                                        </p>
                                                        <p className="text-xs text-gray-400">#{index + 1}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>

            {/* Footer Info */}
            {galleryImages.length > 0 && (
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <p>{galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} in gallery</p>
                    <p className="text-xs">Drag images to reorder. Changes are saved when you click "Save Gallery".</p>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
