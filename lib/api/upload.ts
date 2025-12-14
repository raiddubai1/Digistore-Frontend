const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
  };
}

export interface MultipleUploadResponse {
  success: boolean;
  data: {
    images: Array<{
      url: string;
      publicId: string;
    }>;
  };
}

export async function uploadImage(file: File, token: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const result: UploadResponse = await response.json();
    return result.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadImages(files: File[], token: string): Promise<string[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/upload/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload images');
    }

    const result: MultipleUploadResponse = await response.json();
    return result.data.images.map((img) => img.url);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

export interface ProductFileData {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export async function uploadProductFile(file: File, token: string): Promise<ProductFileData> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload/product-file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    const result: UploadResponse = await response.json();
    return {
      url: result.data.url,
      fileName: result.data.fileName || file.name,
      fileSize: result.data.fileSize || file.size,
      fileType: result.data.fileType || file.type,
    };
  } catch (error) {
    console.error('Error uploading product file:', error);
    throw error;
  }
}

export async function uploadProductFiles(files: File[], token: string): Promise<ProductFileData[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_URL}/upload/product-files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload files');
    }

    const result = await response.json();
    return result.data.files.map((file: { url: string; fileName: string; fileSize: number; fileType: string }) => ({
      url: file.url,
      fileName: file.fileName,
      fileSize: file.fileSize,
      fileType: file.fileType,
    }));
  } catch (error) {
    console.error('Error uploading product files:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

