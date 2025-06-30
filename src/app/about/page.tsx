'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Utensils } from 'lucide-react';
import { restaurantAPI } from '@/lib/api';

export default function AboutPage() {
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
                <h1 className="text-xl font-bold text-gray-900">Hakkımızda</h1>
              </div>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {restaurant?.name || 'Restoranım'} Hakkında
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {restaurant?.description || 'Lezzetin ve kalitenin buluştuğu yer. Her öğün unutulmaz bir deneyim sunuyoruz.'}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                2010 yılında kurulan restoranımız, geleneksel Türk mutfağının lezzetlerini 
                modern sunum teknikleriyle birleştirerek eşsiz bir yemek deneyimi sunmaya başladı.
              </p>
              <p>
                13 yıllık deneyimimizle, her tabakta kaliteyi ve lezzeti bir araya getirmenin 
                gururunu yaşıyoruz. Taze malzemeler, özenle hazırlanan tarifler ve samimi 
                atmosferimizle sizleri ağırlıyoruz.
              </p>
              <p>
                Misyonumuz, her müşterimize evinin sıcaklığında, kaliteli ve lezzetli 
                yemekler sunarak unutulmaz anlar yaşatmaktır.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Restoran İçi"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bizi Ziyaret Edin</h2>
          <p className="text-gray-600 mb-6">
            Lezzetli yemeklerimizi tatmak ve sıcak atmosferimizi deneyimlemek için bekliyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu" 
              className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition-colors"
            >
              Menüyü İncele
            </Link>
            <Link 
              href="/contact" 
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
