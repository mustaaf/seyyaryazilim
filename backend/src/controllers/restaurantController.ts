import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';

// @desc    Get restaurant info
// @route   GET /api/restaurant
// @access  Public
export const getRestaurantInfo = async (req: Request, res: Response) => {
  try {
    let restaurant = await Restaurant.findOne();
    
    // Eğer restoran bilgisi yoksa varsayılan oluştur
    if (!restaurant) {
      restaurant = new Restaurant({
        name: 'Restoranım',
        description: 'Lezzetin ve kalitenin buluştuğu yer',
        phone: '0212 123 45 67',
        email: 'info@restoranim.com',
        address: {
          street: 'Örnek Mah. Lezzet Sok. No:1',
          city: 'İstanbul',
          district: 'Kadıköy',
          postalCode: '34710',
          country: 'Türkiye'
        }
      });
      await restaurant.save();
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update restaurant info
// @route   PUT /api/restaurant
// @access  Private (Admin)
export const updateRestaurantInfo = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      phone,
      email,
      address,
      workingHours,
      socialMedia
    } = req.body;

    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
      // Yeni restoran oluştur
      restaurant = new Restaurant(req.body);
    } else {
      // Mevcut restoranı güncelle
      if (name !== undefined) restaurant.name = name;
      if (description !== undefined) restaurant.description = description;
      if (phone !== undefined) restaurant.phone = phone;
      if (email !== undefined) restaurant.email = email;
      if (address !== undefined) restaurant.address = { ...restaurant.address, ...address };
      if (workingHours !== undefined) restaurant.workingHours = { ...restaurant.workingHours, ...workingHours };
      if (socialMedia !== undefined) restaurant.socialMedia = { ...restaurant.socialMedia, ...socialMedia };
    }

    await restaurant.save();

    res.json({
      success: true,
      message: 'Restoran bilgileri başarıyla güncellendi',
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update restaurant logo
// @route   PUT /api/restaurant/logo
// @access  Private (Admin)
export const updateRestaurantLogo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Logo dosyası gerekli' });
    }

    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restoran bilgisi bulunamadı' });
    }

    restaurant.logo = `/uploads/${req.file.filename}`;
    await restaurant.save();

    res.json({
      success: true,
      message: 'Logo başarıyla güncellendi',
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update restaurant banner
// @route   PUT /api/restaurant/banner
// @access  Private (Admin)
export const updateRestaurantBanner = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Banner dosyası gerekli' });
    }

    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restoran bilgisi bulunamadı' });
    }

    restaurant.banner = `/uploads/${req.file.filename}`;
    await restaurant.save();

    res.json({
      success: true,
      message: 'Banner başarıyla güncellendi',
      data: restaurant
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
