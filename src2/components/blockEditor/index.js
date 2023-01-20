import React from "react";
import "./styles.scss";
import { Editor } from "@tinymce/tinymce-react";
import createSmartInput from "../createSmartInput";
const useDarkMode = window?.matchMedia("(prefers-color-scheme: dark)").matches;
const isSmallScreen = window?.matchMedia("(max-width: 1023.5px)").matches;
/**
 * @description Block Editor Component
 * @type Component
 * @author Inderdeep
 */
const Main = createSmartInput(
  React.forwardRef(
    (props, ref) => {
      return (
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          {...props.editorProps}
          initialValue={props["data-__meta"]?.initialValue}
          onEditorChange={props.onChange}
          init={{
            plugins:
              "preview importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
            editimage_cors_hosts: ["picsum.photos"],
            menubar: "edit view insert format tools table",
            toolbar:
              "undo redo | preview | fullscreen | image | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat  | charmap emoticons    | insertfile media link anchor codesample pagebreak | ltr rtl",

            toolbar_sticky: true,
            toolbar_sticky_offset: isSmallScreen ? 102 : 108,
            image_advtab: true,
            importcss_append: true,
            valid_children : '+body[style]',
            file_picker_callback: (cb, value, meta) => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.addEventListener("change", async (e) => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");

                input.addEventListener("change", (e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.addEventListener("load", () => {
                    /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
                    const id = "blobid" + new Date().getTime();
                    const blobCache =
                      tinymce.activeEditor.editorUpload.blobCache;
                    const base64 = reader.result.split(",")[1];
                    const blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), { title: file.name });
                  });
                  reader.readAsDataURL(file);
                });

                input.click();
              });

              input.click();
            },
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar:
              "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
            noneditable_class: "mceNonEditable",
            toolbar_mode: "sliding",
            contextmenu: "link image table",
            skin: useDarkMode ? "oxide-dark" : "oxide",
            content_css: useDarkMode ? "dark" : "default",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
            branding: false,
            promotion: false,
            images_upload_url : '/test',
            ...props.editorProps?.init,
          }}
          
        />
      );
    },
    {
      defaultValue: "",
    }
  )
);

export default Main;
