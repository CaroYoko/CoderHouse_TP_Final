import { Router } from "express";
import {transport} from  "../utils/mailing.js";

 
const routerMailing = Router();

routerMailing.get('/', async(req, res) => {
  
  let result = await transport.sendMail({
    from: 'CoderTest <carolinaeyokoyama@gmail.com>',
    to: 'yokoyamacarolina@gmail.com',
    subject: 'Correo de prueba',
    html: `
    <div> 
      <p>Puedes recuperar tu contraseña presionando aquí:</p>               
      <a href="https://localhost:5000/api/recover">Recuperar contraseña</a>
    </div>
    `
  })
  res.status(200).json({result: "Email sent"})
});

export default routerMailing