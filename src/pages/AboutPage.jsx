/**
 * AboutPage — Restaurant story and information
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChefHat, Award, Users, Heart } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

function AboutPage() {
  const values = [
    {
      icon: ChefHat,
      title: 'Quality Cuisine',
      description: 'We craft every dish with premium ingredients and authentic recipes passed down through generations.',
    },
    {
      icon: Users,
      title: 'Family Tradition',
      description: 'Built on the foundation of family values and a passion for bringing people together through food.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning chefs dedicated to delivering the finest dining experience every time.',
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'We treat every customer like family, ensuring satisfaction in every meal we serve.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us — Athidhi</title>
        <meta name="description" content="Learn about Athidhi Family Restaurant - our story, values, and passion for authentic cuisine." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-4 bg-gradient-to-br from-brand-50 to-white overflow-hidden">
          <div className="page-container">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl text-gray-600 leading-relaxed">
                Welcome to Athidhi, where tradition meets innovation. Founded with a simple mission: to bring families together through authentic, delicious food prepared with love and care.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="page-container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">A Legacy of Flavor</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  What started as a small family kitchen has blossomed into a beloved restaurant serving our community for decades. Each recipe tells a story of cultural heritage, passed down through generations and perfected over time.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, we remain committed to our roots while embracing modern innovations. Our chefs combine traditional techniques with contemporary presentation to create unforgettable dining experiences that celebrate the art of food.
                </p>
              </div>
              <div className="relative h-80 bg-gradient-to-br from-brand-100 to-brand-50 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-6xl">🍽️</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-white">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="p-8 bg-gray-50 rounded-xl hover:bg-brand-50 transition-colors"
                  >
                    <Icon className="w-12 h-12 text-brand-600 mb-4" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-brand-600 to-brand-700">
          <div className="page-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience Athidhi?
              </h2>
              <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
                Visit us today or order online to discover why Athidhi is your favorite restaurant destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/menu"
                  className="px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Menu
                </a>
                <a
                  href="/contact"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutPage;
