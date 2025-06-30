'use client';

import Image from "next/image";
import Link from "next/link";
import { Utensils, Clock, Star, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { restaurantAPI } from "@/lib/api";

export default function Home() {
  const [restaurant, setRestaurant] = useState<any>(null);

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-amber-800" />
              <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name || 'Restoranım'}</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-amber-800 transition-colors">Ana Sayfa</Link>
              <Link href="/menu" className="text-gray-600 hover:text-amber-800 transition-colors">Menü</Link>
              <Link href="/about" className="text-gray-600 hover:text-amber-800 transition-colors">Hakkımızda</Link>
              <Link href="/contact" className="text-gray-600 hover:text-amber-800 transition-colors">İletişim</Link>
            </nav>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        <div className="relative text-center text-white z-10">
          <h2 className="text-5xl font-bold mb-4">{restaurant?.name || 'Lezzetin Adresi'}</h2>
          <p className="text-xl mb-8">{restaurant?.description || 'Geleneksel tatlarla modern sunum'}</p>
          <Link 
            href="/menu" 
            className="bg-amber-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-900 transition-colors inline-block"
          >
            Menüyü İncele
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Neden Bizi Tercih Etmelisiniz?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Kaliteli hizmet, taze malzemeler ve unutulmaz lezzetlerle size en iyi deneyimi sunuyoruz.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-amber-800" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Kaliteli Yemekler</h4>
              <p className="text-gray-600">Taze ve kaliteli malzemelerle hazırlanan özel tariflerimiz</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-800" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Hızlı Servis</h4>
              <p className="text-gray-600">Siparişlerinizi en kısa sürede hazırlayıp sunuyoruz</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-800" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Müşteri Memnuniyeti</h4>
              <p className="text-gray-600">%100 müşteri memnuniyeti hedefiyle çalışıyoruz</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Utensils className="h-6 w-6 text-amber-600" />
                <h4 className="text-xl font-bold">{restaurant?.name || 'Restoranım'}</h4>
              </div>
              <p className="text-gray-600">{restaurant?.description || 'Lezzetin ve kalitenin buluştuğu yer. Her öğün unutulmaz bir deneyim.'}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                <li><Link href="/menu" className="text-gray-600 hover:text-white transition-colors">Menü</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-amber-600" />
                  <span className="text-gray-600">{restaurant?.phone || '0212 123 45 67'}</span>
                </div>
                <p className="text-gray-600">
                  {restaurant?.address?.street && restaurant?.address?.city 
                    ? `${restaurant.address.street}, ${restaurant.address.district ? restaurant.address.district + ', ' : ''}${restaurant.address.city}, ${restaurant.address.country || 'Türkiye'}`
                    : 'Örnek Mah. Lezzet Sok. No:1\nİstanbul, Türkiye'
                  }
                </p>
                <div className="mt-4">
                  <Link 
                    href="/admin" 
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm inline-flex items-center"
                  >
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-600">&copy; 2025 Restoranım. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
