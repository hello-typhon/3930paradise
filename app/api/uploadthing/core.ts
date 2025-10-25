import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for file:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
  documentUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for document:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
