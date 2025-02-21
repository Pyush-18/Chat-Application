export const asyncHandler = (requestHandler) => async(req, res,next) => {
    try {
        return await requestHandler(req,res,next)
    } catch (error) {
        return res.json({
            message : error.message,
            success: false
        })
    }
}