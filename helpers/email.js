import nodemailer from 'nodemailer'

export const emailRecuperarPassword = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // Informacion del email
    const info = await transport.sendMail({
        from: "Inventario INTI - Sistema de Inventario <inventario@inti.pe>",
        to: email,
        subject: "Inventario INTI - Reestablecer tu password",
        text: "Reestablecer tu password",
        html: `
            <h1 style="font-weight: bold;font-family: sans-serif ">
                Buen Día ${nombre}, has solicitado reestablecer tu contraseña
            </h1>
            <p> Sigue el siguiente enlace para generar una nueva contraseña:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Reestablecer Contraseña</a>
            </p>
        `
    })
}

export const confirmarCuentaEmail = async (datos) => {
    try {
        const { email, nombre, token } = datos
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        // Informacion del email
        const info = await transport.sendMail({
            from: "Inventario INTI - Sistema de Inventario <inventario@inti.pe>",
            to: email,
            subject: "Inventario INTI - Reestablecer tu password",
            text: "Reestablecer tu password",
            html: `
            <h1 style="font-weight: bold;font-family: sans-serif ">
                Buen Día ${nombre}, se envia este correo para la confirmacion de tu cuenta, asi mismo se brindara una contraseña
            </h1>
            <p> Sigue el siguiente enlace para confirmar tu cuenta:
                <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}" >Confirma tu cuenta</a>
            </p>
        `
        })
    } catch (error) {
        console.log(error)
    }
}


