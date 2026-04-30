/**
 * ContactPage — Contact form and information
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 95054 64000',
      link: 'tel:+919505464000',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@Athidhi.in',
      link: 'mailto:hello@Athidhi.in',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Mosayyapeta, atchuthapuram, Atchutapuram, Andhra Pradesh 531011',
      link: 'https://www.google.com/maps/place/ATHIDHI+MANDI+FAMILY+RESTAURANT/@17.5624638,82.976821,17z/data=!4m6!3m5!1s0x3a3975cbaca75603:0x609e70fd832a8e71!8m2!3d17.5624638!4d82.976821!16s%2Fg%2F11plxwz65w!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Mon-Sun: 7:00 AM - 12:00 PM',
      link: '#',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      // In real app, send to backend API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Athidhi</title>
        <meta name="description" content="Get in touch with Athidhi Restaurant. Find our contact information, hours, and location." />
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
                Get in Touch
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl text-gray-600 leading-relaxed">
                Have questions? We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20 px-4">
          <div className="page-container">
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={i}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    variants={fadeUp}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all group"
                  >
                    <Icon className="w-8 h-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20 px-4 bg-white">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Form */}
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>

              {/* Map Placeholder */}
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">Visit Us</h2>
                <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Athidhi Restaurant Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.8830413584823!2d-74.00601492346974!3d40.71282571110045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2s123%20Culinary%20Ln!5e0!3m2!1sen!2sus!4v1234567890"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="page-container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find answers to common questions about Athidhi</p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { q: 'Do you offer delivery?', a: 'Yes! We offer delivery within our service area. Order online and get it delivered hot to your door.' },
                { q: 'Can I make reservations?', a: 'Absolutely! Call us at +1 (555) 123-4567 to make a reservation for dining in.' },
                { q: 'Do you have dietary options?', a: 'Yes, we offer vegetarian, vegan, and gluten-free options. Check our menu or contact us for details.' },
                { q: 'What\'s your policy on cancellations?', a: 'Orders can be cancelled within 15 minutes of placement for a full refund.' },
              ].map((faq, i) => (
                <motion.details
                  key={i}
                  variants={fadeUp}
                  className="p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-brand-300 transition-colors"
                >
                  <summary className="font-semibold text-gray-900">{faq.q}</summary>
                  <p className="mt-3 text-gray-600">{faq.a}</p>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ContactPage;
