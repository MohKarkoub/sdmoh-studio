"use client";
import ProfileCard from "@/components/ProfileCard";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl text-white mb-4 font-display">About SDMoh Studio</h1>
          <p className="text-white/50 max-w-xl mx-auto font-body text-lg md:text-xl">
            Creating coloring books that spark joy, creativity, and calm
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-sm">
              <ProfileCard
                name="SDMoh Studio"
                title="Coloring Book Creator"
                handle="sdmohstudio"
                status="Creating"
                contactText="Get in Touch"
                showUserInfo={true}
                avatarUrl="/images/about-card.jpg"
                iconUrl=""
                grainUrl=""
                enableTilt={true}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                enableMobileTilt={false}
                onContactClick={() => window.location.href = "/contact"}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white/[0.12] backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h2 className="text-3xl text-white mb-4 font-display-alt">Our Story</h2>
              <p className="text-white/60 leading-relaxed mb-4 font-body text-lg">
                At SDMoh Studio, we believe that creativity has no age limit. Our coloring books are designed for everyone — adults seeking relaxation, teens looking for a creative outlet, and kids who love to bring pages to life with color.
              </p>
              <p className="text-white/60 leading-relaxed mb-4 font-body text-lg">
                Each book features bold, easy-to-color designs that reduce stress and spark imagination. From cute cats and cozy animals to serene ocean adventures and bedtime scenes, there&apos;s a world of creativity waiting for you.
              </p>
              <p className="text-white/60 leading-relaxed font-body text-lg">
                We carefully craft every page to ensure a relaxing and enjoyable coloring experience. Whether you&apos;re unwinding after a long day or spending quality time with family, our books are your perfect companion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { number: "50+", label: "Unique Designs Per Book" },
                { number: "7", label: "Coloring Books Published" },
                { number: "All Ages", label: "Suitable for Everyone" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="bg-white/[0.12] backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center"
                >
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent font-display-alt">
                    {stat.number}
                  </div>
                  <div className="text-white/50 mt-1 font-body text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
