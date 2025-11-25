import * as React from "react";

interface WelcomeEmailProps {
  customerName: string;
  email: string;
}

export const WelcomeEmail = ({ customerName, email }: WelcomeEmailProps) => {
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
            padding: 40px;
            text-align: center;
            border-radius: 12px 12px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .feature-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #14b8a6;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            text-align: center;
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
          <h1 style={{ margin: 0, fontSize: '32px' }}>Welcome to Digistore1! 🎉</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '18px' }}>
            Your journey to amazing digital products starts here
          </p>
        </div>

        <div className="content">
          <p>Hi {customerName},</p>
          <p>
            Welcome to Digistore1! We're thrilled to have you join our community of creators,
            learners, and digital product enthusiasts.
          </p>

          <h2 style={{ fontSize: '22px', marginTop: '30px' }}>What You Can Do Now</h2>

          <div className="feature-box">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>📚 Browse Premium Products</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Explore our curated collection of high-quality eBooks, templates, and digital tools
              across multiple categories.
            </p>
          </div>

          <div className="feature-box">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>⚡ Instant Downloads</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Get immediate access to your purchases. No waiting, no hassle - just instant downloads
              ready when you are.
            </p>
          </div>

          <div className="feature-box">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>🔒 Secure & Safe</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Your transactions are protected with industry-standard encryption. Shop with confidence.
            </p>
          </div>

          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <a href="https://digistore1.com/products" className="cta-button">
              Start Exploring Products
            </a>
          </div>

          <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>💡 Pro Tip</h3>
            <p style={{ margin: 0 }}>
              Add products to your wishlist to keep track of items you're interested in. You'll also
              receive notifications when they go on sale!
            </p>
          </div>

          <h2 style={{ fontSize: '22px', marginTop: '40px' }}>Need Help?</h2>
          <p>
            Our support team is here to help you with any questions. Feel free to reach out anytime:
          </p>
          <ul style={{ color: '#6b7280' }}>
            <li>📧 Email: support@digistore1.com</li>
            <li>💬 Live Chat: Available on our website</li>
            <li>📚 Help Center: Find answers to common questions</li>
          </ul>

          <p style={{ marginTop: '30px' }}>
            Thank you for choosing Digistore1. We can't wait to see what you create!
          </p>

          <p>
            Best regards,<br />
            <strong>The Digistore1 Team</strong>
          </p>
        </div>

        <div className="footer">
          <p>© 2024 Digistore1. All rights reserved.</p>
          <p>
            You're receiving this email because you created an account at Digistore1.
          </p>
          <p>
            <a href="#" style={{ color: '#14b8a6', textDecoration: 'none' }}>Unsubscribe</a> •
            <a href="#" style={{ color: '#14b8a6', textDecoration: 'none', marginLeft: '10px' }}>Preferences</a>
          </p>
        </div>
      </body>
    </html>
  );
};

export default WelcomeEmail;

