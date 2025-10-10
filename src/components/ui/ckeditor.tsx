import "../../app/_assets/ck-editor.css"
import { CKEditor } from "@ckeditor/ckeditor5-react";
import AllImages from "./(media-select)/mediaSelect";

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  Paragraph,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { useRef } from "react";
import { File } from "@/app/_types/media_Types/file_Types/fileTypes";
// import MediaPopup from "./media/media-popup";

interface Props {
  id: string;
  onChange?: (content: string) => void;
  initialData?: string;
}

function Editor({ id, onChange, initialData }: Props) {
  const editorRef = useRef<CKEditor<ClassicEditor>>(null);
  const mediaPopupRef = useRef<HTMLDivElement>(null);
  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "insertImageViaUrl",
        "insertTable",
        "highlight",
        "blockQuote",
        "codeBlock",
        "|",
        "indent",
        "outdent",
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      Paragraph,
      SelectAll,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Table,
      TableCellProperties,
      TableProperties,
      TableToolbar,
      TextTransformation,
      Underline,
      Undo,
    ],
    balloonToolbar: ["bold", "italic", "|", "link"],
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },
    initialData,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"],
    },
  };

  function initFileSelector() {
    const imageTool = document.querySelector(`#${id} [data-cke-tooltip-text="Insert image via URL"]`);
    if (imageTool) {
      const clone = imageTool.cloneNode(true);
      imageTool?.parentNode?.replaceChild(clone, imageTool);
      clone.addEventListener("click", () => {
        mediaPopupRef.current?.click();
      });
    }
  }

  function addImage(file: string) {
    editorRef.current?.editor?.commands.execute("insertImage", {
      source: file,
    });
  }

  return (
    <div id={id} className="[&_button]:hidden prose w-full max-w-full">
      <CKEditor
        ref={editorRef}
        editor={ClassicEditor}
        config={editorConfig as any}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange && onChange(data);
        }}
        onReady={initFileSelector}
      />
      <AllImages trigger={<div ref={mediaPopupRef}></div>} onSelect={addImage} />
    </div>
  );
}

export default Editor;
