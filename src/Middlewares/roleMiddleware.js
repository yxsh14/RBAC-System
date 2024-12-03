const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole) {
            return res.status(403).json({ message: "Access Denied. Role not found." });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access Denied. Insufficient permissions." });
        }
        next();
    };
};

export default authorizeRoles;