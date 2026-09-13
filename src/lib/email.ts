import nodemailer from "nodemailer";
import { RegistrationRecord } from "./db";

interface SendEmailParams {
  registration: RegistrationRecord;
}

export async function sendConfirmationEmail({ registration }: SendEmailParams) {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || '"Robotics Club MMMUT" <noreply@mmmut.ac.in>';

  const subject = "EmbedX Registration Received — Robotics Club MMMUT";

  const memberRowsHtml = registration.members.length > 0
    ? registration.members
        .map(
          (m, idx) => `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px; color: #94a3b8; font-size: 13px;">Member ${idx + 1}</td>
            <td style="padding: 10px; color: #f1f5f9; font-weight: 500; font-size: 13px;">${m.name} (${m.branch} - Yr ${m.year})</td>
          </tr>
        `
        )
        .join("")
    : "";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #0b1222; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #00f0ff33;">
      <div style="font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #38bdf8; font-weight: 700; margin-bottom: 6px;">
        Robotics Club MMMUT
      </div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
        EMBED<span style="color: #00f0ff;">X</span>
      </h1>
      <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Registration Received</p>
    </div>

    <!-- Main Body -->
    <div style="padding: 32px 24px;">
      <p style="font-size: 16px; line-height: 24px; color: #e2e8f0; margin-top: 0;">
        Dear <strong>${registration.leaderName}</strong>,
      </p>

      <p style="font-size: 15px; line-height: 24px; color: #cbd5e1;">
        Thank you for registering your team for <strong>EmbedX</strong>. Your registration details and kit fee transaction have been successfully recorded in our system.
      </p>

      <!-- Registration ID Highlight Box -->
      <div style="background: rgba(14, 165, 233, 0.08); border: 1px dashed #0284c7; border-radius: 8px; padding: 18px; margin: 24px 0; text-align: center;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 600;">
          Registration ID
        </div>
        <div style="font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #38bdf8; margin: 6px 0; font-family: monospace;">
          ${registration.registrationId}
        </div>
        <div style="font-size: 12px; color: #94a3b8;">
          Please keep your Registration ID for future reference.
        </div>
      </div>

      <!-- Verification Notice Alert -->
      <div style="background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
        <div style="font-size: 14px; font-weight: 600; color: #fbbf24; margin-bottom: 4px;">
          Status: PENDING ADMIN VERIFICATION
        </div>
        <div style="font-size: 13px; color: #fde68a; line-height: 20px;">
          Your registration has been received successfully. Your registration will be confirmed once the payment is verified by the Robotics Club MMMUT team.
        </div>
      </div>

      <!-- Registration Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tbody>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px; color: #94a3b8; font-size: 13px; width: 40%;">Team Name</td>
            <td style="padding: 10px; color: #f1f5f9; font-weight: 600; font-size: 13px;">${registration.teamName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px; color: #94a3b8; font-size: 13px;">Leader</td>
            <td style="padding: 10px; color: #f1f5f9; font-weight: 500; font-size: 13px;">${registration.leaderName} (${registration.leaderBranch} - Yr ${registration.leaderYear})</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px; color: #94a3b8; font-size: 13px;">Total Members</td>
            <td style="padding: 10px; color: #f1f5f9; font-weight: 500; font-size: 13px;">${registration.memberCount}</td>
          </tr>
          ${memberRowsHtml}
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px; color: #94a3b8; font-size: 13px;">UTR / Transaction ID</td>
            <td style="padding: 10px; color: #38bdf8; font-family: monospace; font-weight: 600; font-size: 13px;">${registration.utr}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size: 14px; line-height: 22px; color: #94a3b8; margin-bottom: 24px;">
        You can track the real-time status of your verification at any time on your dedicated dashboard.
      </p>

      <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #64748b; line-height: 18px;">
        <p style="margin: 0 0 6px 0;">Robotics Club, Madan Mohan Malaviya University of Technology, Gorakhpur</p>
        <p style="margin: 0;">For queries, contact roboticsclub@mmmut.ac.in</p>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  // Check if SMTP is configured
  if (!host || !user || !pass) {
    console.log("------------------------------------------------------------");
    console.log("📧 [SIMULATED EMAIL DISPATCH] (SMTP credentials not in .env)");
    console.log(`To: ${registration.email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Registration ID: ${registration.registrationId}`);
    console.log(`Team: ${registration.teamName}`);
    console.log("------------------------------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    });

    const info = await transporter.sendMail({
      from,
      to: registration.email,
      subject,
      html: htmlContent
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // Return gracefully so registration record is not lost
    return { success: false, error: String(error) };
  }
}
