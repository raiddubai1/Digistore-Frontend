import * as React from "react";

interface PasswordResetEmailProps {
  customerName: string;
  resetLink: string;
  expiryTime: string;
}

export const PasswordResetEmail = ({
  customerName,
  resetLink,
  expiryTime,
}: PasswordResetEmailProps) => {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1 style={{ margin: 0, fontSize: '28px' }}>🔐 Password Reset Request</h1>
        </div>

        <div className="content">
          <p>Hi {customerName},</p>
          <p>
            We received a request to reset your password for your Digistore1 account.
            If you didn't make this request, you can safely ignore this email.
          </p>

          <p>
            To reset your password, click the button below:
          </p>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a href={resetLink} className="reset-button">
              Reset My Password
            </a>
          </div>

          <div className="warning-box">
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>⏰ This link will expire in {expiryTime}.</strong><br />
              For security reasons, please reset your password as soon as possible.
            </p>
          </div>

          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '30px' }}>
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            wordBreak: 'break-all',
            background: '#f9fafb',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {resetLink}
          </p>

          <div style={{ background: '#fee2e2', padding: '15px', borderRadius: '8px', marginTop: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#dc2626' }}>
              🛡️ Security Tips
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#7f1d1d' }}>
              <li>Never share your password with anyone</li>
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
              <li>If you didn't request this reset, contact support immediately</li>
            </ul>
          </div>

          <p style={{ marginTop: '30px' }}>
            If you have any questions or concerns, please contact our support team.
          </p>

          <p>
            Best regards,<br />
            <strong>The Digistore1 Team</strong>
          </p>
        </div>

        <div className="footer">
          <p>© 2024 Digistore1. All rights reserved.</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
            This is an automated email. Please do not reply to this message.
          </p>
          <p>
            <a href="#" style={{ color: '#14b8a6', textDecoration: 'none' }}>Contact Support</a> •
            <a href="#" style={{ color: '#14b8a6', textDecoration: 'none', marginLeft: '10px' }}>Help Center</a>
          </p>
        </div>
      </body>
    </html>
  );
};

export default PasswordResetEmail;

