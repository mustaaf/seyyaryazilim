'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Utensils, MapPin, Phone, Mail, Clock, Instagram, Facebook, Globe, Send } from 'lucide-react';
import { restaurantAPI } from '@/lib/api';

export default function ContactPage() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadRestaurantInfo = async () => {
      try {
        const response = await restaurantAPI.getInfo();
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error loading restaurant info:', error);
      }
    };

    loadRestaurantInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatAddress = () => {
    if (!restaurant?.address) return 'Adres bilgisi mevcut değil';
    
    const { street, district, city, postalCode, country } = restaurant.address;
    let address = street || '';
    if (district) address += `, ${district}`;
    if (city) address += `, ${city}`;
    if (postalCode) address += ` ${postalCode}`;
    if (country) address += `, ${country}`;
    
    return address || 'Adres bilgisi mevcut değil';
  };

  const workingHours = [
    { day: 'Pazartesi', hours: '09:00 - 22:00' },
    { day: 'Salı', hours: '09:00 - 22:00' },
    { day: 'Çarşamba', hours: '09:00 - 22:00' },
    { day: 'Perşembe', hours: '09:00 - 22:00' },
    { day: 'Cuma', hours: '09:00 - 22:00' },
    { day: 'Cumartesi', hours: '09:00 - 22:00' },
    { day: 'Pazar', hours: '10:00 - 21:00' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-amber-800">
                <ArrowLeft className="h-5 w-5" />
                <span>Ana Sayfa</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Utensils className="h-6 w-6 text-amber-800" />
                <h1 className="text-xl font-bold text-gray-900">İletişim</h1>
              </div>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişime Geçin</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya rezervasyon talepleriniz için bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">İletişim Bilgileri</h2>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-amber-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                  <p className="text-gray-600">{formatAddress()}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-amber-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-gray-600">{restaurant?.phone || '0212 123 45 67'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-amber-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                  <p className="text-gray-600">{restaurant?.email || 'info@restoranim.com'}</p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Çalışma Saatleri
              </h3>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-3">
                  {workingHours.map((day, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">{day.day}</span>
                      <span className="text-gray-900 font-medium">{day.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media */}
            {restaurant?.socialMedia && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Sosyal Medya</h3>
                <div className="flex space-x-4">
                  {restaurant.socialMedia.instagram && (
                    <a 
                      href={restaurant.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-100 p-3 rounded-full hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="h-6 w-6 text-pink-600" />
                    </a>
                  )}
                  {restaurant.socialMedia.facebook && (
                    <a 
                      href={restaurant.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="h-6 w-6 text-blue-600" />
                    </a>
                  )}
                  {restaurant.socialMedia.website && (
                    <a 
                      href={restaurant.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Globe className="h-6 w-6 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönder</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0555 123 45 67"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Konu seçiniz</option>
                    <option value="rezervasyon">Rezervasyon</option>
                    <option value="sikayet">Şikayet</option>
                    <option value="oneri">Öneri</option>
                    <option value="genel">Genel Bilgi</option>
                    <option value="catering">Catering Hizmeti</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-800 text-white py-3 px-4 rounded-lg hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gönderiliyor...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="h-5 w-5 mr-2" />
                      Mesajı Gönder
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Konum</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Harita Entegrasyonu</p>
                <p className="text-sm">Google Maps veya OpenStreetMap entegrasyonu eklenebilir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
