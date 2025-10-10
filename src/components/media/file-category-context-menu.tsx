import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import axios from "axios";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
} from "../ui/dialog-or-drawer";
import FileCategoryEditor from "./file-category-editor";
import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import { queryClient } from "@/lib/context/ReactQueryContext";
import { useToast } from "../ui/use-toast";

interface Props {
  children: React.ReactNode;
  category: MediaCategory;
  setCategory: any;
}

function FileCategoryContextMenu({ children, category, setCategory }: Props) {
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const { toast } = useToast();

  function handleEdit() {
    setShowCategoryEditor(!showCategoryEditor);
  }

  async function handleDelete() {
    // const toastId = toast.loading("Deleting category...");
    try {
      await axios.post(`/api/file-categories/destroy`, {
        url: category.url,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["media-categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["file-selector"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["files", category.id],
        }),

        queryClient.invalidateQueries({
          queryKey: ["files"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["media"],
        }),
      ]);

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["media-categories"],
        }),
        queryClient.refetchQueries({
          queryKey: ["file-selector"],
        }),
      ]);
      setCategory("all");
      toast({
        description: `Category has been deleted successfully.`,
        variant: "default",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        description: `Failed to deleted category.`,
        variant: "destructive",
        //  className: "bg-green-600 text-white",
      });
    }
  }

  return (
    <Fragment>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEdit}>Edit</ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogOrDrawer
        open={showCategoryEditor}
        onOpenChange={setShowCategoryEditor}
      >
        <DialogOrDrawerContent>
          <DialogOrDrawerHeader>
            <DialogOrDrawerTitle>Edit Category</DialogOrDrawerTitle>
          </DialogOrDrawerHeader>
          <FileCategoryEditor
            initialData={category}
            edit
            onSuccess={() => setShowCategoryEditor(false)}
          />
        </DialogOrDrawerContent>
      </DialogOrDrawer>
    </Fragment>
  );
}

export default FileCategoryContextMenu;
