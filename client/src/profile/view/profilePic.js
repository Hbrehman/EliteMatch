export const Uppy = () => {};
/*
  // const uppy = Uppy(...);
  const fileInput = document.querySelector("#my-file-input");

  fileInput.addEventListener("change", event => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      try {
        uppy.addFile({
          source: "file input",
          name: file.name,
          type: file.type,
          data: file
        });
      } catch (err) {
        if (err.isRestriction) {
          // handle restrictions
          console.log("Restriction error:", err);
        } else {
          // handle other errors
          console.error(err);
        }
      }
    });
  });
};

const uppy = Uppy({
  id: "uppy",
  autoProceed: false,
  allowMultipleUploads: false,
  debug: false,
  restrictions: {
    // maxFileSize: null,
    // maxNumberOfFiles: null,
    // minNumberOfFiles: null,
    allowedFileTypes: "Image/*"
  },
  meta: {},
  onBeforeFileAdded: (currentFile, files) => currentFile,
  onBeforeUpload: files => {},
  locale: {},
  store: new DefaultStore(),
  logger: justErrorsLogger
});
*/
