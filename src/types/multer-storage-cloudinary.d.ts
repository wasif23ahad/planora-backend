declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { v2 as cloudinary } from 'cloudinary';

  interface Options {
    cloudinary: typeof cloudinary;
    params?: {
      folder?: string;
      allowed_formats?: string[];
      transformation?: any[];
      public_id?: (req: any, file: any) => string;
      [key: string]: any;
    };
  }

  function CloudinaryStorage(options: Options): StorageEngine;
  
  export default CloudinaryStorage;
}
