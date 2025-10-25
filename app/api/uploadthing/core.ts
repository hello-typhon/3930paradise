import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for file:", file.url);
      return { url: file.url };
    }),
  documentUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for document:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
