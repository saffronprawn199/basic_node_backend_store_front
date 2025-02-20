import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const verifyAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authorizationHeader: string | undefined = req.headers.authorization;

        // Check authorizationheader
        if (!authorizationHeader) {
            throw new Error('No authorization header provided');
        }
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
        next();
    } catch (error) {
        res.status(401);
    }
};

export default verifyAuthToken;