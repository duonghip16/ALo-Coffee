// VietQR service for dynamic payment QR code generation

export interface VietQRPayment {
  amount: number
  description: string
  accountNumber: string
  bankCode: string
  bankName?: string
}

export interface OrderPayment {
  orderId: string
  amount: number
  refCode: string
}

export function generateOrderRefCode(): string {
  // Generate unique reference code: ORD-<shortid>
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `ORD-${result}`
}

export function generateVietQRPayload(payment: VietQRPayment): string {
  // Build VietQR payload following NAPAS standard
  // Format: bankCode|accountNumber|amount|description
  const { amount, description, accountNumber, bankCode } = payment

  // Base64 encode the payload
  const payload = `${bankCode}|${accountNumber}|${amount}|${description}`
  return btoa(payload)
}

export function generateVietQRUrl(payment: VietQRPayment): string {
  // VietQR QR code API endpoint
  const params = new URLSearchParams({
    accountNo: payment.accountNumber,
    accountName: "ALo Coffee",
    acqId: payment.bankCode,
    amount: payment.amount.toString(),
    addInfo: payment.description,
    format: "text",
    template: "compact",
  })

  return `https://api.vietqr.io/v2/generate?${params.toString()}`
}

export async function generateQRCode(payment: VietQRPayment): Promise<string> {
  try {
    const response = await fetch(generateVietQRUrl(payment))
    const data = await response.json()
    return data.data?.qrDataURL || ""
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

// Mock webhook verification (in production, this would be handled by Cloud Functions)
export async function verifyPaymentWebhook(refCode: string, amount: number): Promise<boolean> {
  // In production, this would verify against actual payment gateway
  // For now, simulate verification
  console.log(`Verifying payment: ${refCode}, amount: ${amount}`)

  // Mock verification logic
  if (refCode.startsWith('ORD-') && amount > 0) {
    return true
  }

  return false
}

export function createPaymentForOrder(orderId: string, total: number): OrderPayment {
  const refCode = generateOrderRefCode()
  return {
    orderId,
    amount: total,
    refCode
  }
}
