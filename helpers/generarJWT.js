import jwt from 'jsonwebtoken';

const generarJWT = (uid = '') => {
    return jwt.sign({ uid }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });    
    
        // return new Promise((resolve, reject) => {
    
        //     const payload = { uid };
    
        //     jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
        //         expiresIn: '4h'
        //     }, (err, token) => {
    
        //         if (err) {
        //             console.log(err);
        //             reject('No se pudo generar el token');
        //         } else {
        //             resolve(token);
        //         }
    
        //     })
    
        // })
    
    }

export default generarJWT;