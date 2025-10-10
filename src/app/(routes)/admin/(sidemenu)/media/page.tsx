"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import UploadOptions from "@/components/media/upload-options";
import MediaFilters from "@/components/media/media-filters";
import FileUploader from "@/components/media/file-uploader";
import MediaFilterContextProvider from "@/lib/context/media-filter-context";
import MediaCenterFiles from "@/components/media/media-center-files";

function MediaCenter() {
  const [uploadCategory, setUploadCategory] = useState("");
  const [tab, setTab] = useState("library");
  const [activeButton, setActiveButton] = useState<string | null> (null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  return (
    <MediaFilterContextProvider>
      <Card>
        <CardHeader>
          <CardTitle>Media Center</CardTitle>
          <CardDescription>Manage your media files.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex justify-between flex-wrap gap-4">
              <TabsList>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
              </TabsList>
              {tab === "upload" && <UploadOptions category={uploadCategory} setCategory={setUploadCategory} />}
              {tab === "library" && <MediaFilters activeButton={activeButton} setActiveButton={setActiveButton} />}
            </div>
            <TabsContent value="upload">
              <FileUploader category={uploadCategory} showCategoryEditor={showCategoryEditor} setShowCategoryEditor={setShowCategoryEditor}  />
            </TabsContent>
            <TabsContent value="library">
              <MediaCenterFiles  activeButton={activeButton} setActiveButton={setActiveButton} showCategoryEditor={showCategoryEditor} setShowCategoryEditor={setShowCategoryEditor}/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MediaFilterContextProvider>
  );
}

export default MediaCenter;