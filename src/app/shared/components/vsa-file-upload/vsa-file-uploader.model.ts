export class VSAAttachmentFile {
    fileId: string | number;
    fileDetails: File | string;
    isUploaded: boolean;
    uploadingPercentage?: number;
    fileName: string;
    fileSize?: number; // in bytes
    extension?: string;
    extractedData?: object; // Store JSON
    error?: string;
    fileBinary?: string;
}