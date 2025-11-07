"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getSettings, type Settings } from "@/lib/firestore-service"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { getVietnamTimestamp } from "@/lib/date-utils"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings()
      setSettings(data)
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const phoneRegex = /^0\d{9}$/
      if (!phoneRegex.test(formData.phone.trim())) {
        toast.error("Số điện thoại phải có 10 số và bắt đầu bằng số 0")
        setLoading(false)
        return
      }
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: getVietnamTimestamp()
      })
      toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.")
      setFormData({ name: "", phone: "", message: "" })
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    }
    setLoading(false)
  }

  return (
    <MainLayout>
      <section className="py-20 bg-[#b6a188] dark:bg-[#6f5e48] overflow-y-auto scroll-smooth">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-8 md:mb-16"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#382a1a] dark:text-[#F7EFE5] mb-3 md:mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-sm md:text-xl text-[#382a1a]/70 dark:text-[#F7EFE5]">
              Hãy để lại thông tin, chúng tôi sẽ liên hệ ngay!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-4 md:p-8 bg-[#d7b890] dark:bg-card border-[#E8DCC8] dark:border-border">
                <h2 className="text-xl md:text-2xl font-bold text-[#3A2416] dark:text-[#FEF7ED] mb-4 md:mb-6">Gửi tin nhắn</h2>
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Họ tên</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số điện thoại</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0123456789"
                      pattern="0\d{9}"
                      maxLength={10}
                      title="Số điện thoại phải có 10 số và bắt đầu bằng số 0"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tin nhắn</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Nội dung tin nhắn..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                  </Button>
                </form>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 md:space-y-6 overflow-y-auto max-h-[600px] md:max-h-none"
            >
              <Card className="p-4 md:p-6 bg-[#c09a69] dark:bg-card border-[#E8DCC8] dark:border-border">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#6B4423] rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-[#3A2416] dark:text-[#FEF7ED]">Địa chỉ</h3>
                    <p className="text-sm md:text-base text-[#3A2416]/70 dark:text-[#FEF7ED]">{settings?.shopAddress || "Sài Gòn, Việt Nam"}</p>
                    <a
                      href={settings?.shopMapUrl || "https://maps.app.goo.gl/d7GZ3HGgcUtAqnNX6"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6B4423] dark:text-[#FEF7ED] hover:underline text-sm mt-2 inline-block"
                    >
                      Xem bản đồ →
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 bg-[#c09a69] dark:bg-card border-[#E8DCC8] dark:border-border">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#6B4423] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-[#3A2416] dark:text-[#FEF7ED]">Điện thoại</h3>
                    <a href={`tel:${settings?.shopPhone || "+84123456789"}`} className="text-sm md:text-base text-[#3A2416]/70 dark:text-[#FEF7ED] hover:text-[#6B4423]">
                      {settings?.shopPhone || "+84 123 456 789"}
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 bg-[#c09a69] dark:bg-card border-[#E8DCC8] dark:border-border">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#6B4423] rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-[#3A2416] dark:text-[#FEF7ED]">Email</h3>
                    <a href={`mailto:${settings?.shopEmail || "hello@alo-coffee.com"}`} className="text-sm md:text-base text-[#3A2416]/70 dark:text-[#FEF7ED] hover:text-[#6B4423]">
                      {settings?.shopEmail || "hello@alo-coffee.com"}
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 bg-[#c09a69] dark:bg-card border-[#E8DCC8] dark:border-border">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#6B4423] rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-[#3A2416] dark:text-[#FEF7ED]">Giờ mở cửa</h3>
                    <p className="text-sm md:text-base text-[#3A2416]/70 dark:text-[#FEF7ED]">Thứ 2 - Chủ nhật</p>
                    <p className="text-sm md:text-base text-[#3A2416]/70 dark:text-[#FEF7ED]">5:00 - 18:00</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 md:mt-16 max-w-6xl mx-auto"
          >
            <Card className="overflow-hidden bg-[#c09a69] dark:bg-card border-[#E8DCC8] dark:border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4548906654524!2d106.62525287584896!3d10.853675889300108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a20be00e0e1%3A0x3a8a1e0e0e0e0e0e!2s149%2F10%20B%C3%B9i%20V%C4%83n%20Ng%E1%BB%AF%2C%20Hi%E1%BB%87p%20Th%C3%A0nh%2C%20Qu%E1%BA%ADn%2012%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                width="100%"
                height="300"
                className="md:h-[400px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  )
}
