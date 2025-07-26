import axios from 'axios'
import api from '@/utils/api'

export const portPresignedURL = async (file: File): Promise<any> => {
  const presignedRes = await api.post('/files/s3-presigned-post', {
    fileName: file.name,
    fileType: file.type,
  })

  return presignedRes.data
}

export const uploadFileToS3 = async (
  url: string,
  formData: FormData,
): Promise<void> => {
  await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getSecretURL = async (key: string): Promise<string> => {
  const presignedRrl = await api.post('/files/secure-resume-url', {
    key,
  })

  return presignedRrl.data.url
}
