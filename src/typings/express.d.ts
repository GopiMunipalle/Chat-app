declare global {
    namespace Express {
        interface Request {
            _id:string;
            email: string; 
        }
    }
}

export{}