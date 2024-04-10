export default async function (req: any, res: any) {
    res.status(200).json({
        success: true,
        // key: process.env.API_KEY
    });
}
