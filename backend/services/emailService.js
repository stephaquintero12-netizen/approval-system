const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNewRequestNotification = async (request, approver) => {
  try {
    const recipientEmail = 'nicolstephanieb.q@gmail.com';
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `📋 NUEVA SOLICITUD - ${request.request_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡NUEVA SOLICITUD CREADA! 🎉</h2>
          <p style="color: #64748b;"><strong>Sistema de Aprobaciones</strong></p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e293b; margin-top: 0;">📋 Detalles de la Solicitud</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>🆔 ID:</strong></td>
                <td style="padding: 8px 0;"><strong>${request.request_id}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>📝 Título:</strong></td>
                <td style="padding: 8px 0;">${request.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>🔧 Tipo:</strong></td>
                <td style="padding: 8px 0;">${request.request_type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>🚨 Prioridad:</strong></td>
                <td style="padding: 8px 0;">
                  <span style="
                    padding: 6px 12px; 
                    border-radius: 6px; 
                    font-size: 12px;
                    font-weight: bold;
                    background: ${request.priority === 'high' ? '#ef4444' : request.priority === 'medium' ? '#f59e0b' : '#10b981'};
                    color: white;
                  ">
                    ${request.priority.toUpperCase()}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>👤 Solicitante:</strong></td>
                <td style="padding: 8px 0;">${request.requester_name}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: #2563eb; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px;">
               📊 Ir al Dashboard
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Esta es una notificación automática del Sistema de Aprobaciones.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);    
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendNewRequestNotification
};