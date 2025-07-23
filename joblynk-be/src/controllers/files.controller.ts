import type { Request, Response } from "express";
import AWS from "aws-sdk";

class FilesController {
    private s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    public createPresignedPost = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { fileName, fileType } = req.body;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Fields: { key: `uploads/${Date.now()}_${fileName}` },
            Conditions: [
                ["content-length-range", 0, 10485760], // 10MB limit
                ["starts-with", "$Content-Type", ""],
            ],
            Expires: 60, // seconds
        };

        this.s3.createPresignedPost(params, (err, data) => {
            if (err) {
                res.status(500).json({
                    data: null,
                    message: "Presigned URL generation failed",
                });
                return;
            }
            console.log("Presigned Post Data:", data);
            res.json({
                data: {
                    url: data.url,
                    fields: data.fields,
                    key: data.fields.key, // or use the generated key
                },
                message: "Presigned URL generated successfully",
            });
        });
    };

    public getSecureResumeUrl = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const s3Key = req.query.key as string;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: s3Key,
            Expires: 300,
        };

        const url = this.s3.getSignedUrl("getObject", params);
        res.json({ url });
    };
}

export default new FilesController();