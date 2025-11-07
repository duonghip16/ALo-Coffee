"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { motion } from "framer-motion"
import { Coffee, Clock, Award, Heart, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: Coffee,
      title: "Cà phê nguyên chất",
      description: "100% hạt Robusta & Arabica chọn lọc",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Clock,
      title: "Phục vụ nhanh chóng",
      description: "Đặt hàng online, nhận ngay tại quán",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Award,
      title: "Chất lượng đảm bảo",
      description: "Cam kết hoàn tiền nếu không hài lòng",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Heart,
      title: "Không gian ấm cúng",
      description: "Thiết kế hiện đại, thoải mái",
      color: "from-pink-500 to-rose-600"
    }
  ]

  return (
    <MainLayout>
      <HeroSection />
      <FeaturedProducts />

      {/* Features Section */}
      <section className="py-20 bg-[#937649] dark:bg-[#5a3823]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#331d12] dark:text-[#FEF7ED] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Tại sao chọn ALo Coffee?
            </h2>
            <p className="text-lg text-[#432c19] dark:text-[#E8DCC8] max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm cà phê tuyệt vời nhất
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="bg-[#d8b887] dark:bg-[#3A2416] rounded-2xl p-8 border border-[#E8DCC8] dark:border-[#6B4423] hover:shadow-2xl hover:border-[#C47B3E] dark:hover:border-[#C47B3E] transition-all duration-300">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-[#2A1A12] dark:text-[#FEF7ED] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#6B4423] dark:text-[#E8DCC8]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-[#8E5522] to-[#6B4423] dark:from-[#3A2416] dark:to-[#2A1A12] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Coffee className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sẵn sàng thưởng thức?
            </h2>
            <p className="text-xl text-white/95 dark:text-[#FEF7ED] mb-8">
              Đặt món ngay hôm nay và nhận ưu đãi đặc biệt cho đơn hàng đầu tiên!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => router.push("/menu")}
                className="bg-white dark:bg-[#FEF7ED] text-[#6B4423] dark:text-[#3A2416] hover:bg-[#FEF7ED] dark:hover:bg-white text-lg px-12 py-6 rounded-full shadow-2xl font-bold"
              >
                Đặt món ngay
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>   
    </MainLayout>
  )
}
