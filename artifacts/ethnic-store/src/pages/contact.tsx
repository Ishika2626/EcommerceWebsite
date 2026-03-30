import { Layout } from "@/components/layout";
import { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ASubject: ${form.subject}%0A%0AMessage:%0A${form.message}`;
    const mailto = `mailto:vastraverge@gmail.com?subject=${encodeURIComponent("VastraVerge Enquiry: " + form.subject)}&body=${body}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary/5 border-b border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">We'd Love to Hear from You</p>
          <h1 className="font-display text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Reach out for orders, queries, or just to say hello!
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get in Touch</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">📍</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Address</p>
                    <p className="text-muted-foreground text-sm">Surat, Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">📞</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Phone</p>
                    <a href="tel:+919974460041" className="text-muted-foreground text-sm hover:text-primary transition-colors block">+91 9974460041</a>
                    <a href="tel:+917802820906" className="text-muted-foreground text-sm hover:text-primary transition-colors block">+91 7802820906</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">✉️</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Email</p>
                    <a href="mailto:vastraverge@gmail.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">vastraverge@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">💬</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">WhatsApp</p>
                    <a href="https://wa.me/919974460041" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">Chat with us on WhatsApp</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-lg">📷</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-0.5">Instagram</p>
                    <a href="https://www.instagram.com/vastraverge/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">@vastraverge</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-2xl p-5">
              <p className="text-sm font-semibold text-primary mb-1">🌍 International Orders?</p>
              <p className="text-sm text-muted-foreground">We ship worldwide! International courier charges apply. Contact us for a shipping quote.</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Your email client should have opened. We'll get back to you soon.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }} className="mt-6 text-primary font-medium hover:underline text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h2>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Ishika Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 9xxxxxxxxx"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject *</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      >
                        <option value="">Select a topic</option>
                        <option value="Order Query">Order Query</option>
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="International Shipping">International Shipping</option>
                        <option value="Return & Exchange">Return & Exchange</option>
                        <option value="Wholesale / Bulk Order">Wholesale / Bulk Order</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Your Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Send Message ✉️
                  </button>
                  <p className="text-xs text-muted-foreground text-center">This will open your email app to send the message to vastraverge@gmail.com</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
