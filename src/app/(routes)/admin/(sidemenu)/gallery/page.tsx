"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    X,
    Plus,
    GripVertical,
    ImageIcon,
    Edit,
    Trash2,
    Eye,
    Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import AllImages from "@/components/ui/(media-select)/mediaSelect";

// Types based on API response
interface GalleryImage {
    id: number;
    url: string;
    thumbnailUrl: string;
    mime: string;
    size: number;
    width: number;
    height: number;
}

interface Gallery {
    id: number;
    uuid: string;
    title: string;
    slug: string;
    description: string;
    status: boolean;
    images: GalleryImage[];
    createdAt: string;
    updatedAt: string;
}

interface GalleryFormData {
    id?: number;
    title: string;
    slug: string;
    description: string;
    status: string;
    images: number[];
}

// For local state display
interface LocalGalleryImage {
    id: number;
    imageUrl: string;
    fileName: string;
}

const GalleryPage = () => {
    const { toast } = useToast();

    // List state
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [isListLoading, setIsListLoading] = useState(true);

    // Form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
    const [viewingGallery, setViewingGallery] = useState<Gallery | null>(null);

    // Form data
    const [formData, setFormData] = useState<GalleryFormData>({
        title: "",
        slug: "",
        description: "",
        status: "1",
        images: [],
    });
    const [selectedImages, setSelectedImages] = useState<LocalGalleryImage[]>([]);

    // Fetch galleries on mount
    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        setIsListLoading(true);
        try {
            const response = await fetch("/api/gallery", {
                method: "POST",
            });
            const result = await response.json();

            if (result.code === 0 && result.data) {
                setGalleries(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch galleries");
            }
        } catch (error) {
            console.error("Error fetching galleries:", error);
            toast({
                description: "Failed to fetch galleries",
                variant: "destructive",
            });
        } finally {
            setIsListLoading(false);
        }
    };

    const fetchGalleryDetails = async (id: number) => {
        try {
            const response = await fetch(`/api/gallery/${id}`);
            const result = await response.json();

            if (result.code === 0 && result.data) {
                return result.data;
            }
            throw new Error(result.message || "Failed to fetch gallery details");
        } catch (error) {
            console.error("Error fetching gallery details:", error);
            toast({
                description: "Failed to fetch gallery details",
                variant: "destructive",
            });
            return null;
        }
    };

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            if (name === "title") {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    // Handle image selection from media library
    const handleImageSelect = useCallback(
        (imageUrl: string, imageId?: number) => {
            const id = imageId || Date.now();
            const newImage: LocalGalleryImage = {
                id,
                imageUrl: imageUrl,
                fileName: imageUrl.split("/").pop() || `image-${id}`,
            };

            setSelectedImages((prev) => {
                if (prev.some((img) => img.imageUrl === imageUrl)) {
                    toast({
                        description: "This image is already selected",
                        variant: "destructive",
                    });
                    return prev;
                }
                return [...prev, newImage];
            });

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, id],
            }));
        },
        [toast]
    );

    // Handle image removal
    const handleRemoveImage = useCallback((id: number) => {
        setSelectedImages((prev) => prev.filter((img) => img.id !== id));
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((imgId) => imgId !== id),
        }));
    }, []);

    // Handle drag and drop reordering
    const handleDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;

        setSelectedImages((prev) => {
            const items = [...prev];
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination!.index, 0, reorderedItem);
            return items;
        });

        setFormData((prev) => {
            const items = [...prev.images];
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination!.index, 0, reorderedItem);
            return { ...prev, images: items };
        });
    }, []);

    // Open dialog for creating new gallery
    const handleCreateNew = () => {
        setEditingGallery(null);
        setFormData({
            title: "",
            slug: "",
            description: "",
            status: "1",
            images: [],
        });
        setSelectedImages([]);
        setIsDialogOpen(true);
    };

    // Open dialog for editing gallery
    const handleEdit = async (gallery: Gallery) => {
        setEditingGallery(gallery);
        setFormData({
            id: gallery.id,
            title: gallery.title,
            slug: gallery.slug,
            description: gallery.description,
            status: gallery.status ? "1" : "0",
            images: gallery.images.map((img) => img.id),
        });
        setSelectedImages(
            gallery.images.map((img) => ({
                id: img.id,
                imageUrl: img.url,
                fileName: img.url.split("/").pop() || `image-${img.id}`,
            }))
        );
        setIsDialogOpen(true);
    };

    // View gallery details
    const handleView = async (gallery: Gallery) => {
        const details = await fetchGalleryDetails(gallery.id);
        if (details) {
            setViewingGallery(details);
            setIsViewDialogOpen(true);
        }
    };

    // Submit form (create or update)
    const handleSubmit = async () => {
        if (!formData.title.trim() || !formData.slug.trim()) {
            toast({
                description: "Title and slug are required",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const endpoint = editingGallery
                ? "/api/gallery/update"
                : "/api/gallery/create";

            const body = editingGallery
                ? {
                    id: editingGallery.id,
                    title: formData.title,
                    slug: formData.slug,
                    description: formData.description,
                    status: formData.status,
                    images: formData.images,
                }
                : {
                    title: formData.title,
                    slug: formData.slug,
                    description: formData.description,
                    status: formData.status,
                    images: formData.images,
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    description: editingGallery
                        ? "Gallery updated successfully"
                        : "Gallery created successfully",
                    className: "bg-green-500 text-white",
                });
                setIsDialogOpen(false);
                fetchGalleries();
            } else {
                throw new Error(result.error || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving gallery:", error);
            toast({
                description:
                    error instanceof Error ? error.message : "Failed to save gallery",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Galleries</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your galleries with images for the user-facing website.
                    </p>
                </div>
                <Button onClick={handleCreateNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Gallery
                </Button>
            </div>

            {/* Gallery List */}
            <div className="bg-white rounded-lg border">
                {isListLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : galleries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <ImageIcon className="h-16 w-16 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">
                            No galleries found
                        </h3>
                        <p className="text-sm mt-1">
                            Click "Create Gallery" to add a new gallery
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery.id}
                                className="p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {gallery.images && gallery.images.length > 0 ? (
                                            <img
                                                src={gallery.images[0].thumbnailUrl || gallery.images[0].url}
                                                alt={gallery.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Info */}
                                    <div>
                                        <h3 className="font-medium">{gallery.title}</h3>
                                        <p className="text-sm text-gray-500">{gallery.slug}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-400">
                                                {gallery.images?.length || 0} images
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${gallery.status
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {gallery.status ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleView(gallery)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(gallery)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingGallery ? "Edit Gallery" : "Create Gallery"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter gallery title"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder="gallery-slug"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter gallery description"
                                rows={3}
                            />
                        </div>

                        {/* Status */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="status"
                                checked={formData.status === "1"}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        status: checked ? "1" : "0",
                                    }))
                                }
                            />
                            <Label htmlFor="status">Active</Label>
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Images</Label>
                                <AllImages
                                    trigger={
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add Images
                                        </Button>
                                    }
                                    onSelect={handleImageSelect}
                                    toUpdate="additional"
                                    uploadedImages={selectedImages.map((img) =>
                                        img.id.toString()
                                    )}
                                />
                            </div>

                            {selectedImages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg text-gray-400">
                                    <ImageIcon className="h-8 w-8 mb-2" />
                                    <p className="text-sm">No images selected</p>
                                </div>
                            ) : (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="gallery-images" direction="horizontal">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3"
                                            >
                                                {selectedImages.map((image, index) => (
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
                                                                    className="absolute top-1 left-1 z-10 bg-white/80 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                                                                >
                                                                    <GripVertical className="h-3 w-3 text-gray-600" />
                                                                </div>

                                                                {/* Remove Button */}
                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveImage(image.id)
                                                                    }
                                                                    className="absolute top-1 right-1 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>

                                                                {/* Image */}
                                                                <div className="aspect-square bg-gray-100">
                                                                    <img
                                                                        src={image.imageUrl}
                                                                        alt={image.fileName}
                                                                        className="w-full h-full object-cover"
                                                                    />
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
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : editingGallery ? (
                                "Update Gallery"
                            ) : (
                                "Create Gallery"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewingGallery?.title}</DialogTitle>
                    </DialogHeader>

                    {viewingGallery && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Slug:</span>{" "}
                                    {viewingGallery.slug}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span>{" "}
                                    <span
                                        className={`px-2 py-0.5 rounded-full ${viewingGallery.status
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {viewingGallery.status ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {viewingGallery.description && (
                                <div>
                                    <span className="font-medium text-sm">Description:</span>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {viewingGallery.description}
                                    </p>
                                </div>
                            )}

                            <div>
                                <span className="font-medium text-sm">
                                    Images ({viewingGallery.images?.length || 0})
                                </span>
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 mt-2">
                                    {viewingGallery.images?.map((image) => (
                                        <div
                                            key={image.id}
                                            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                                        >
                                            <img
                                                src={image.thumbnailUrl || image.url}
                                                alt={`Image ${image.id}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-xs text-gray-400 flex gap-4">
                                <span>
                                    Created:{" "}
                                    {new Date(viewingGallery.createdAt).toLocaleDateString()}
                                </span>
                                <span>
                                    Updated:{" "}
                                    {new Date(viewingGallery.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                setIsViewDialogOpen(false);
                                if (viewingGallery) handleEdit(viewingGallery);
                            }}
                        >
                            Edit Gallery
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GalleryPage;
