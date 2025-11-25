import * as React from "react";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  orderDate: string;
  items: Array<{
    title: string;
    price: number;
    license: string;
  }>;
  total: number;
  downloadLinks: Array<{
    productTitle: string;
    downloadUrl: string;
  }>;
}

export const OrderConfirmationEmail = ({
  customerName,
  orderId,
  orderDate,
  items,
  total,
  downloadLinks,
}: OrderConfirmationEmailProps) => {
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
          .order-details {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .item {
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .item:last-child {
            border-bottom: none;
          }
          .download-button {
            display: inline-block;
            background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            margin: 10px 0;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
          }
          .total {
            font-size: 24px;
            font-weight: bold;
            color: #14b8a6;
            text-align: right;
            margin-top: 20px;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1 style={{ margin: 0, fontSize: '28px' }}>Order Confirmed! 🎉</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Thank you for your purchase</p>
        </div>

        <div className="content">
          <p>Hi {customerName},</p>
          <p>
            Your order has been confirmed and your digital products are ready to download!
          </p>

          <div className="order-details">
            <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>
              <strong>Order Number:</strong> {orderId}
            </p>
            <p style={{ margin: '0', color: '#6b7280' }}>
              <strong>Order Date:</strong> {orderDate}
            </p>
          </div>

          <h2 style={{ fontSize: '20px', marginTop: '30px' }}>Order Items</h2>
          {items.map((item, index) => (
            <div key={index} className="item">
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {item.license} License • ${item.price.toFixed(2)}
              </div>
            </div>
          ))}

          <div className="total">Total: ${total.toFixed(2)}</div>

          <h2 style={{ fontSize: '20px', marginTop: '40px' }}>Download Your Products</h2>
          <p>Click the buttons below to download your digital products:</p>

          {downloadLinks.map((link, index) => (
            <div key={index} style={{ margin: '15px 0' }}>
              <a href={link.downloadUrl} className="download-button">
                📥 Download {link.productTitle}
              </a>
            </div>
          ))}

          <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', marginTop: '30px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>⚠️ Important:</strong> Download links are valid for 7 days. You can also access your
              purchases anytime from your account dashboard.
            </p>
          </div>

          <p style={{ marginTop: '30px' }}>
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>

          <p>
            Best regards,<br />
            <strong>The Digistore1 Team</strong>
          </p>
        </div>

        <div className="footer">
          <p>© 2024 Digistore1. All rights reserved.</p>
          <p>
            <a href="#" style={{ color: '#14b8a6', textDecoration: 'none' }}>View Order</a> •
            <a href="#" style={{ color: '#14b8a6', textDecoration: 'none', marginLeft: '10px' }}>Contact Support</a>
          </p>
        </div>
      </body>
    </html>
  );
};

export default OrderConfirmationEmail;

