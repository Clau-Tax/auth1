const adminMiddleware = (req:any, res:any, next:any) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};

export default adminMiddleware;