"use client"

import { motion } from "framer-motion"
import { Coffee, Heart, Users, Award, Star, ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"

export default function AboutPage() {
  const router = useRouter()

  const coreValues = [
    {
      icon: Star,
      title: "Chất lượng",
      desc: "Cà phê rang xay tươi mỗi ngày, nguyên liệu cao cấp được chọn lọc kỹ càng",
      color: "from-[#C47B3E] to-[#8E5522]"
    },
    {
      icon: Heart,
      title: "Tâm huyết",
      desc: "Mỗi ly cà phê được pha chế với tình yêu và sự tận tâm của barista",
      color: "from-[#6B4423] to-[#4e3521]"
    },
    {
      icon: Users,
      title: "Cộng đồng",
      desc: "Không gian kết nối, nơi mọi người gặp gỡ và chia sẻ câu chuyện",
      color: "from-[#2D5016] to-[#1a3009]"
    },
    {
      icon: Award,
      title: "Uy tín",
      desc: "Cam kết chất lượng phục vụ và trải nghiệm khách hàng tốt nhất",
      color: "from-[#8B6F47] to-[#6B4423]"
    }
  ]

  return (
    <MainLayout>
      <div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-[#796244] via-[#c08a4a] to-[#78634a] dark:from-[#6d4b37] dark:via-[#623d1e] dark:to-[#37251b]">
          <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-5" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                className="inline-block mb-8"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Coffee className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold text-[#FEF7ED] dark:text-[#FEF7ED] mb-6 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Về ALo Coffee
              </h1>
              <p className="text-xl md:text-2xl text-white/70 dark:text-white/80 leading-relaxed max-w-2xl mx-auto">
                Nơi bạn dừng chân giữa Sài Gòn nhộn nhịp để tìm lại một khoảnh khắc bình yên
              </p>
            </motion.div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-24 bg-[#b39a7e] dark:bg-[#412c1b]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl max-w-xs md:max-w-none mx-auto"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#C47B3E] to-[#3A2C20]" />
                  <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Coffee className="w-24 h-24 md:w-40 md:h-40 text-[#FAF6F0] opacity-30" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#3A2C20] dark:text-[#f5e6d0] mb-4 md:mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Câu chuyện thương hiệu
                  </h2>
                  <div className="space-y-3 md:space-y-4 text-sm md:text-lg text-[#6B5A4A] dark:text-[#9b7b5c] leading-relaxed">
                    <p>
                      ALo Coffee – nơi bạn dừng chân giữa Sài Gòn nhộn nhịp để tìm lại một khoảnh khắc bình yên.
                    </p>
                    <p>
                      Ở ALo, mỗi tách cà phê là một câu chuyện. Chúng tôi tin rằng hương vị thật sự đến từ sự tận tâm – 
                      từ những hạt cà phê được chọn kỹ, đến nụ cười của barista khi bạn bước vào quán.
                    </p>
                    <div className="mt-4 md:mt-6 p-4 md:p-6 bg-[#C47B3E]/10 dark:bg-[#3b2416]/50 rounded-xl border-l-4 border-[#C47B3E] dark:border-[#c08a4a]">
                      <p className="text-sm md:text-base text-[#3A2C20] dark:text-[#f5e6d0] font-semibold italic">
                        "Một tách cà phê ngon không chỉ đánh thức vị giác, mà còn đánh thức tâm hồn."
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Values & Space Combined */}
        <section className="py-24 bg-[#755f46] dark:bg-[#52361f]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-16"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#f5e6d0] dark:text-[#f5e6d0] mb-2 md:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Giá trị & Không gian
              </h2>
              <p className="text-sm md:text-lg text-[#d7b99a] dark:text-[#9b7b5c]">Những điều đặc biệt tại ALo Coffee</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
              {[
                { icon: Star, title: "Chất lượng", desc: "Cà phê được chọn lọc kỹ, pha chế chuẩn vị từng ly.", color: "from-[#C47B3E] to-[#8E5522]" },
                { icon: Coffee, title: "Làm việc", desc: "Góc yên tĩnh, wifi mạnh – lý tưởng cho dân văn phòng, freelancer.", color: "from-[#C47B3E] to-[#8E5522]" },
                { icon: Award, title: "Uy tín", desc: "Duy trì chất lượng và sự tin tưởng qua từng trải nghiệm.", color: "from-[#8B6F47] to-[#6B4423]" },
                { icon: Heart, title: "Tâm huyết", desc: "Mỗi tách cà phê là cả đam mê và sự tận tâm của barista.", color: "from-[#6B4423] to-[#4e3521]" },
                { icon: Coffee, title: "Chill", desc: "Nhạc nhẹ, không gian thư giãn giúp bạn quên đi nhịp sống hối hả.", color: "from-[#6B4423] to-[#4e3521]" },
                { icon: Coffee, title: "Sân vườn", desc: "Không gian thoáng đãng, nhiều cây xanh, đón gió tự nhiên.", color: "from-[#2D5016] to-[#1a3009]" }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <div className={`bg-linear-to-br ${item.color} rounded-xl md:rounded-2xl p-3 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full`}>
                      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full -mr-8 -mt-8 md:-mr-12 md:-mt-12" />
                      <div className="relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className="inline-block mb-2 md:mb-4"
                        >
                          <Icon className="w-6 h-6 md:w-10 md:h-10" />
                        </motion.div>
                        <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">{item.title}</h3>
                        <p className="text-white/80 text-[10px] md:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center bg-fixed" />
          <div className="absolute inset-0 bg-linear-to-b from-[#55402e] to-[#3d271a]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Coffee className="w-16 h-16 text-[#C47B3E] mx-auto mb-6" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Thử ngay ALo Coffee
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Ghé ALo để cảm nhận hương vị cà phê đặc biệt và không gian ấm cúng.<br />
                Chúng tôi luôn sẵn sàng phục vụ bạn với tất cả tình yêu dành cho cà phê.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="lg"
                    onClick={() => router.push("/menu")}
                    className="bg-[#aa764b] text-white hover:bg-[#87613f] text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-[#C47B3E]/50 transition-all font-semibold"
                  >
                    <Coffee className="mr-2 w-6 h-6" />
                    Xem menu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }} 
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/contact")}
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white/20 hover:border-white text-lg px-10 py-7 rounded-full font-semibold"
                  >
                    <MapPin className="mr-2 w-6 h-6" />
                    Xem vị trí quán
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
