import AWS from 'aws-sdk';

type UploadImageParams = {
  fileName: string
  image: Buffer
}

class S3Service {
  public instance: AWS.S3

  constructor(instance: AWS.S3) {
    this.instance = instance;
  }

  public async uploadImageAndReturnUrl({ fileName, image }: UploadImageParams): Promise<string> {
    try {
      const uploadedImage = await this.instance.upload({
        Bucket: process.env.S3_DEFAULT_IMAGES_BUCKET!,
        Key: fileName,
        Body: image,
        ContentType: 'image/jpg',
        ACL: 'public-read',
      }).promise()

      return uploadedImage.Location;
    } catch (error) {
      console.error("Could not upload image to S3", error)

      throw error;
    }
  }
}

export default S3Service;