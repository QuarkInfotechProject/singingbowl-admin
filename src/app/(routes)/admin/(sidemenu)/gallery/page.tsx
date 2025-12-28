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

interface PaginationInfo {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);

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

    // Fetch galleries on mount and when page changes
    useEffect(() => {
        fetchGalleries();
    }, [currentPage]);

    const fetchGalleries = async () => {
        setIsListLoading(true);
        try {
            const response = await fetch(`/api/gallery?page=${currentPage}`, {
                method: "POST",
            });
            const result = await response.json();

            if (result.code === 0 && result.data) {
                // Transform the response: convert flat image array to gallery objects
                const imageData = result.data.data || result.data;
                const transformedData = imageData.map((image: any) => {
                    // Extract filename without extension for title
                    const filename = image.imageUrl.split('/').pop() || '';
                    const titleFromFilename = filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

                    return {
                        id: image.id,
                        uuid: `uuid-${image.id}`,
                        title: titleFromFilename || `Image ${image.id}`,
                        slug: filename.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                        description: "",
                        status: true, // Default to active
                        images: [
                            {
                                id: image.id,
                                url: image.imageUrl,
                                thumbnailUrl: image.thumbnailUrl,
                                mime: image.mime,
                                size: image.size,
                                width: image.width,
                                height: image.height,
                            }
                        ],
                        createdAt: image.created_at,
                        updatedAt: image.updated_at,
                    } as Gallery;
                });

                setGalleries(transformedData);

                // Store pagination info
                if (result.data.pagination) {
                    setPagination(result.data.pagination);
                }
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

    // Submit form - update gallery ID 3 with selected images
    const handleSubmit = async () => {
        if (formData.images.length === 0) {
            toast({
                description: "Please select at least one image",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const endpoint = "/api/gallery/update";

            // Fetch existing gallery data from API to get current image IDs
            let existingImageIds: number[] = [];
            try {
                console.log("🔍 Fetching existing gallery data from /api/gallery/3...");
                const response = await fetch(`/api/gallery/3`);
                const result = await response.json();
                console.log("📦 Gallery fetch response:", result);

                if (result.code === 0 && result.data && Array.isArray(result.data)) {
                    existingImageIds = result.data.map((img: any) => img.id);
                    console.log("✅ Existing image IDs extracted:", existingImageIds);
                } else {
                    console.warn("⚠️ Unexpected response structure:", result);
                }
            } catch (error) {
                console.error("❌ Error fetching existing gallery:", error);
                // Continue with empty array if fetch fails
            }

            console.log("🆕 New image IDs from form:", formData.images);

            // Combine existing images with new ones (remove duplicates)
            const allImageIds = [...new Set([...existingImageIds, ...formData.images])];
            console.log("🔗 Combined image IDs (existing + new):", allImageIds);

            const body = {
                id: 3, // Hardcoded gallery ID
                images: allImageIds,
            };

            console.log("📤 Final payload being sent:", body);

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok || result.code === 0) {
                toast({
                    description: "Images added to gallery successfully",
                    className: "bg-green-500 text-white",
                });
                setIsDialogOpen(false);
                setSelectedImages([]);
                setFormData({
                    title: "",
                    slug: "",
                    description: "",
                    status: "1",
                    images: [],
                });
                setCurrentPage(1); // Reset to first page
                fetchGalleries();
            } else {
                throw new Error(result.message || result.error || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving gallery:", error);
            toast({
                description:
                    error instanceof Error ? error.message : "Failed to add images",
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
                    Add Images
                </Button>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white rounded-lg border p-6">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery.id}
                                className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                {/* Image */}
                                {gallery.images && gallery.images.length > 0 ? (
                                    <img
                                        src={gallery.images[0].thumbnailUrl || gallery.images[0].url}
                                        alt={gallery.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-300" />
                                    </div>
                                )}

                                {/* Overlay with title on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <div className="text-white">
                                        <h3 className="font-medium text-sm line-clamp-2">
                                            {gallery.title}
                                        </h3>
                                        <p className="text-xs text-gray-300 mt-1">
                                            {new Date(gallery.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-gray-600">
                            Showing {pagination.from} to {pagination.to} of {pagination.total} images
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1 || isListLoading}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                                    // Show first page, last page, current page, and pages around current
                                    const showPage =
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);

                                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                                    const showEllipsisAfter = page === currentPage + 2 && currentPage < pagination.last_page - 2;

                                    if (showEllipsisBefore || showEllipsisAfter) {
                                        return <span key={page} className="px-2 text-gray-400">...</span>;
                                    }

                                    if (!showPage) return null;

                                    return (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            disabled={isListLoading}
                                            className="min-w-[2.5rem]"
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                                disabled={currentPage === pagination.last_page || isListLoading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Add Images to Gallery
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-2">
                            Select images to add to the gallery. Selected images will be added to existing images.
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Images */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Images</Label>
                                <AllImages
                                    trigger={
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Select Images
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
                                    <p className="text-xs text-gray-400 mt-1">Click "Select Images" to add images</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                                    </p>
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
                                </div>
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
                                    Adding...
                                </>
                            ) : (
                                "Add Images"
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
