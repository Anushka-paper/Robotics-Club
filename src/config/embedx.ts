/**
 * EmbedX Central Configuration
 * Official Robotics Club MMMUT Event Configuration
 */

export const EMBEDX_CONFIG = {
  eventName: "EmbedX",
  eventSubtitle: "Robotics & Embedded Systems Flagship Event",
  organization: "Robotics Club MMMUT",
  university: "Madan Mohan Malaviya University of Technology, Gorakhpur",
  
  // Kit / Registration Fee
  kitFee: "₹1414",
  kitFeeNote: "Per team kit inclusive of microcontroller board, sensor bundle & workshop kit",
  
  // QR Code configuration:
  // To use a real UPI QR Code image, simply set `qrCodeImageUrl: "/images/payment-qr.png"`
  // Setting it to null/empty will display the futuristic branded SVG QR code placeholder.
  payment: {
    qrCodeImageUrl: "/qr-pay.jpeg" as string | null,
    qrPlaceholderText: "QR CODE PLACEHOLDER",
    qrScanInstruction: "Scan to pay for the EmbedX kit",
    upiId: "",
    accountHolder: "Robotics Club MMMUT",
    note: "Make sure the UTR/Transaction ID and payment screenshot are clearly visible and accurate.",
    maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"]
  },

  // Dropdown options
  branches: [
    "CSE",
    "IT",
    "ECE",
    "ECE-IoT",
    "EE",
    "ME",
    "CE",
    "CHE",
    "BBA",
    "B.Pharm.",
    "Other"
  ] as const,

  years: ["I", "II", "III", "IV"] as const,

  memberCountOptions: [1, 2, 3] as const,

  // Status mappings
  status: {
    payment: {
      PENDING: { label: "Payment Pending", color: "amber", bg: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
      VERIFIED: { label: "Payment Verified", color: "emerald", bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
      REJECTED: { label: "Payment Rejected", color: "rose", bg: "bg-rose-500/10 border-rose-500/30 text-rose-400" }
    },
    registration: {
      PENDING: { label: "Pending Admin Verification", color: "amber", bg: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
      CONFIRMED: { label: "Registration Confirmed", color: "emerald", bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
      REJECTED: { label: "Registration Rejected", color: "rose", bg: "bg-rose-500/10 border-rose-500/30 text-rose-400" }
    }
  }
};

export type Branch = (typeof EMBEDX_CONFIG.branches)[number];
export type Year = (typeof EMBEDX_CONFIG.years)[number];
