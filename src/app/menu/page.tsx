'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Utensils, ArrowLeft, Search, Filter } from 'lucide-react';
import { categoriesAPI, productsAPI } from '@/lib/api';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll()
      ]);
      setCategories(categoriesData.data || []);
      setProducts(productsData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId?._id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.isActive;
  }).sort((a: any, b: any) => {
    // Popüler ürünleri en üste al
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    // Aynı türdeyse isme göre sırala
    return a.name.localeCompare(b.name);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
                <h1 className="text-xl font-bold text-gray-900">Menümüz</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-amber-700 placeholder:text-gray-600 text-gray-800"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Kategori:</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-300'
              }`}
            >
              Tümü
            </button>
            {categories.map((category: any) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category._id
                    ? 'bg-amber-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6">
          {filteredProducts.map((product: any) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                {/* Fotoğraf - Sol taraf */}
                <div className="relative w-48 h-32 bg-gray-50 flex-shrink-0 rounded-l-lg overflow-hidden">
                  <Image
                    src={product.images?.[0] ? `http://localhost:5001${product.images[0]}` : '/images/default-food.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-2 rounded-lg"
                  />
                  {product.isPopular && (
                    <div className="absolute top-2 left-2 bg-amber-800 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Popüler 🔥
                    </div>
                  )}
                </div>
                
                {/* İçerik - Sağ taraf */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'Açıklama mevcut değil'}</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <span className="text-xl font-bold text-amber-800">₺{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <Utensils className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0 
                ? 'Henüz menüye ürün eklenmemiş.' 
                : 'Arama kriterlerinizi değiştirip tekrar deneyin.'
              }
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
