const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendBookingConfirmationEmail = async ({
  toEmail,
  patientName,
  caregiverName,
  service,
  date,
  duration,
  totalAmount,
  bookingId,
  method,
  transactionId,
}) => {
  await transporter.sendMail({
    from: `"Care24" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Booking Confirmed — ${bookingId}`,
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0ebe2; border-radius: 12px; overflow: hidden;">
        
        <div style="background: #219067; padding: 28px 32px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Care<span style="color: #fb923c;">24</span></h1>
          <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 14px;">Official Payment Receipt</p>
          <div style="margin-top: 12px; display: inline-block; background: rgba(255,255,255,0.15); border-radius: 20px; padding: 6px 16px;">
            <span style="color: white; font-size: 13px;">✅ Payment Successful</span>
          </div>
        </div>

        <div style="padding: 28px 32px;">
          <p style="font-size: 16px; color: #1a3a1a;">Hi <strong>${patientName}</strong>, your booking is confirmed!</p>

          <div style="background: #f9fafb; border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; margin-bottom: 24px;">
            <span style="color: #9ca3af; font-size: 14px;">Booking ID</span>
            <span style="color: #1a7a4a; font-weight: 700; font-size: 15px;">${bookingId}</span>
          </div>

          <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Booking Details</p>
          <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
            ${[
              ["Caregiver", caregiverName],
              ["Service", service],
              ["Date", date],
              ["Duration", duration],
            ]
              .map(
                ([k, v]) => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 11px 0; color: #9ca3af;">${k}</td>
                <td style="padding: 11px 0; text-align: right; font-weight: 600; color: #1a3a1a;">${v}</td>
              </tr>`,
              )
              .join("")}
          </table>

          <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.08em; margin: 20px 0 8px;">Payment Details</p>
          <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
            ${[
              ["Method", method],
              ["Transaction ID", transactionId],
            ]
              .map(
                ([k, v]) => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 11px 0; color: #9ca3af;">${k}</td>
                <td style="padding: 11px 0; text-align: right; font-weight: 600; color: #1a3a1a;">${v}</td>
              </tr>`,
              )
              .join("")}
          </table>

        <table style="width: 100%; margin-top: 20px; padding-top: 16px; border-top: 2px solid #e8f0e9; border-collapse: collapse;">
  <tr>
    <td style="font-size: 18px; font-weight: 700; color: #1a3a1a;">Total Paid</td>
    <td style="font-size: 32px; font-weight: 700; color: #1a7a4a; text-align: right;">&#8377;${totalAmount}</td>
  </tr>
</table>

          <div style="margin-top: 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 12px 16px;">
            <span style="font-size: 14px; font-weight: 600; color: #15803d;">✔ Payment Verified & Booking Confirmed</span>
          </div>
        </div>

        <div style="border-top: 1px solid #e0ebe2; padding: 14px 32px; display: flex; justify-content: space-between;">
          <span style="font-size: 12px; color: #9ca3af;">care24.in · support@care24.in</span>
          <span style="font-size: 12px; color: #9ca3af;">Thank you for trusting us 🙏</span>
        </div>

      </div>
    `,
  });
};

module.exports = sendBookingConfirmationEmail;
