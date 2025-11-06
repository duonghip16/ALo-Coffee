export async function generateInvoiceHash(invoiceData: any): Promise<string> {
  const dataString = JSON.stringify({
    orderId: invoiceData.orderId,
    total: invoiceData.total,
    items: invoiceData.items,
    timestamp: invoiceData.createdAt
  })
  
  const encoder = new TextEncoder()
  const data = encoder.encode(dataString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

export async function verifyInvoiceHash(invoiceData: any, hash: string): Promise<boolean> {
  const computedHash = await generateInvoiceHash(invoiceData)
  return computedHash === hash
}
