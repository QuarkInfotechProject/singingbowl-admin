import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";

interface Props {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

function UploadOptions({ category, setCategory }: Props) {
  const { data: categories, isPending } = useQuery<MediaCategory[]>({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/mediaCategory");
      return data?.data;
    },
  });

  return (
    <div className="flex gap-4 flex-wrap">
      {/* <Select value={category} onValueChange={setCategory} disabled={isPending}>
        <SelectTrigger className="w-fit h-9 [&_span]:flex [&_span]:gap-2">
          <SelectValue className="capitalize" placeholder={isPending ? "Loading..." : "Category"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {categories?.map((category) => (
            <SelectItem className="capitalize" key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
    </div>
  );
}

export default UploadOptions;