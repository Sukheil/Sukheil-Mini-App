import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// 🎨 ДИЗАЙН СИСТЕМА И КОНСТАНТЫ
const THEME = {
  colors: {
    primary: '#0088cc',
    secondary: '#FFD700',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    dark: '#1a1a1a',
    light: '#f8f9fa',
    gradient: {
      primary: 'linear-gradient(135deg, #0088cc 0%, #0066aa 100%)',
      gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      sunset: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 10px 30px rgba(0,0,0,0.2)',
    glow: '0 0 20px rgba(0,136,204,0.5)'
  },
  animations: {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    smooth: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    bounce: { type: "spring", stiffness: 400, damping: 10 }
  }
};

// 📊 МОКОВЫЕ ДАННЫЕ
const SERVICES = [
  {
    id: '1',
    category: 'excursions',
    name: { ru: 'Обзорная экскурсия по Дубаю', en: 'Dubai City Tour' },
    description: { ru: 'Откройте для себя лучшие достопримечательности Дубая за один день' },
    price: 250,
    oldPrice: 350,
    currency: 'AED',
    duration: 240,
    rating: 4.9,
    reviewsCount: 234,
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
    instantBooking: true,
    featured: true,
    tags: ['популярное', 'бестселлер'],
    availableSlots: 12
  },
  {
    id: '2',
    category: 'parks',
    name: { ru: 'Ferrari World Abu Dhabi', en: 'Ferrari World Abu Dhabi' },
    description: { ru: 'Самый большой крытый тематический парк в мире' },
    price: 385,
    currency: 'AED',
    duration: 480,
    rating: 4.8,
    reviewsCount: 189,
    images: ['https://images.unsplash.com/photo-1570097692059-89e0f2733d5e?w=800'],
    instantBooking: true,
    tags: ['адреналин', 'семейное']
  },
  {
    id: '3',
    category: 'yachts',
    name: { ru: 'Аренда яхты с капитаном', en: 'Yacht Rental with Captain' },
    description: { ru: 'Роскошная яхта на 10 человек для незабываемого отдыха' },
    price: 1500,
    oldPrice: 2000,
    currency: 'AED',
    duration: 240,
    rating: 5.0,
    reviewsCount: 67,
    images: ['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800'],
    instantBooking: false,
    tags: ['VIP', 'романтика']
  },
  {
    id: '4',
    category: 'attractions',
    name: { ru: 'Бурдж-Халифа: 124 + 125 этаж', en: 'Burj Khalifa: Level 124 + 125' },
    description: { ru: 'Посетите самое высокое здание в мире' },
    price: 189,
    currency: 'AED',
    duration: 90,
    rating: 4.7,
    reviewsCount: 512,
    images: ['https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800'],
    instantBooking: true,
    tags: ['must-see', 'фото'],
    availableSlots: 8
  },
  {
    id: '5',
    category: 'cars',
    name: { ru: 'Lamborghini Huracan - аренда', en: 'Lamborghini Huracan Rental' },
    description: { ru: 'Прокат суперкара с доставкой к отелю' },
    price: 3500,
    currency: 'AED',
    duration: 1440,
    rating: 5.0,
    reviewsCount: 45,
    images: ['https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800'],
    instantBooking: false,
    tags: ['luxury', 'эксклюзив']
  }
];

const CATEGORIES = [
  { id: 'all', name: { ru: 'Все услуги', en: 'All Services' }, icon: '🏆', count: 156 },
  { id: 'excursions', name: { ru: 'Экскурсии', en: 'Tours' }, icon: '🗺️', count: 45 },
  { id: 'parks', name: { ru: 'Парки', en: 'Parks' }, icon: '🎢', count: 28 },
  { id: 'attractions', name: { ru: 'Достопримечательности', en: 'Attractions' }, icon: '🏛️', count: 34 },
  { id: 'yachts', name: { ru: 'Яхты', en: 'Yachts' }, icon: '⛵', count: 25 },
  { id: 'cars', name: { ru: 'Авто', en: 'Cars' }, icon: '🏎️', count: 24 }
];

// 🔧 TELEGRAM WEBAPP HOOK
const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState({
    id: 123456789,
    first_name: 'Иван',
    last_name: 'Иванов',
    username: 'ivan_ivanov',
    language_code: 'ru'
  });

  useEffect(() => {
    // В реальном приложении здесь будет window.Telegram.WebApp
    const tg = {
      ready: () => console.log('Telegram WebApp ready'),
      expand: () => console.log('Expanded'),
      MainButton: {
        show: () => console.log('Main button shown'),
        hide: () => console.log('Main button hidden'),
        setText: (text) => console.log('Button text:', text),
        onClick: (callback) => console.log('Button click handler set')
      },
      BackButton: {
        show: () => console.log('Back button shown'),
        hide: () => console.log('Back button hidden')
      },
      HapticFeedback: {
        impactOccurred: (style) => console.log('Haptic:', style),
        notificationOccurred: (type) => console.log('Notification:', type)
      },
      themeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        button_color: '#0088cc',
        button_text_color: '#ffffff'
      }
    };
    
    setWebApp(tg);
    tg.ready();
    tg.expand();
  }, []);

  return { webApp, user };
};

// 🎭 АНИМАЦИОННЫЕ КОМПОНЕНТЫ
const AnimatedCard = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay, ...THEME.animations.smooth }}
    whileHover={{ scale: 1.02, transition: THEME.animations.spring }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
);

const PulseButton = ({ children, onClick, variant = 'primary', size = 'md', ...props }) => {
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantStyles = {
    primary: {
      background: THEME.colors.gradient.primary,
      color: 'white',
      boxShadow: THEME.shadows.md
    },
    secondary: {
      background: THEME.colors.gradient.gold,
      color: THEME.colors.dark,
      boxShadow: THEME.shadows.md
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${THEME.colors.primary}`,
      color: THEME.colors.primary
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className={`rounded-full font-semibold ${sizeClasses[size]} transition-all`}
      style={variantStyles[variant]}
      animate={variant === 'primary' ? pulseAnimation : {}}
      whileHover={{ scale: 1.05, boxShadow: THEME.shadows.lg }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// 🏠 ГЛАВНЫЙ ЭКРАН
const HomeScreen = ({ onNavigate }) => {
  const { user } = useTelegram();
  const [activePromo, setActivePromo] = useState(0);
  
  const promos = [
    {
      title: 'Скидка 30% на все экскурсии',
      subtitle: 'Только до конца месяца!',
      gradient: THEME.colors.gradient.sunset,
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'
    },
    {
      title: 'VIP туры с личным гидом',
      subtitle: 'Эксклюзивные маршруты',
      gradient: THEME.colors.gradient.ocean,
      image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo(prev => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Экскурсий', value: '156', icon: '🎯' },
    { label: 'Довольных клиентов', value: '12K+', icon: '😊' },
    { label: 'Лет опыта', value: '8', icon: '⭐' },
    { label: 'Гидов', value: '45', icon: '👥' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white"
    >
      {/* Шапка с приветствием */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-2xl font-bold mb-2">
            Привет, {user.first_name}! 👋
          </h1>
          <p className="text-blue-100">Откройте для себя лучшее в ОАЭ</p>
        </motion.div>
        
        <motion.div
          className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -left-5 -bottom-5 w-32 h-32 bg-blue-400 rounded-full opacity-20"
          animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Промо слайдер */}
      <div className="relative -mt-12 mx-4 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePromo}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={THEME.animations.smooth}
            className="relative h-48 rounded-2xl overflow-hidden shadow-xl"
            style={{ background: promos[activePromo].gradient }}
          >
            <img 
              src={promos[activePromo].image} 
              alt="Promo"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{promos[activePromo].title}</h2>
              <p className="text-lg opacity-90">{promos[activePromo].subtitle}</p>
              <PulseButton
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => onNavigate('catalog')}
              >
                Подробнее →
              </PulseButton>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Индикаторы */}
        <div className="flex justify-center mt-3 gap-2">
          {promos.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full bg-blue-600 transition-all`}
              animate={{ width: index === activePromo ? 24 : 8 }}
              style={{ opacity: index === activePromo ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🎫', label: 'Мои билеты', screen: 'bookings', badge: 3 },
            { icon: '❤️', label: 'Избранное', screen: 'favorites' },
            { icon: '🎁', label: 'Акции', screen: 'promos', badge: 'new' },
            { icon: '💬', label: 'Поддержка', screen: 'support' }
          ].map((action, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <motion.div
                className="relative bg-white rounded-2xl p-4 shadow-md text-center"
                whileHover={{ y: -5, boxShadow: THEME.shadows.lg }}
                onClick={() => onNavigate(action.screen)}
              >
                {action.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                  >
                    {typeof action.badge === 'number' ? action.badge : '!'}
                  </motion.div>
                )}
                <div className="text-3xl mb-2">{action.icon}</div>
                <div className="text-xs font-medium text-gray-600">{action.label}</div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Категории услуг */}
      <div className="px-4 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
          Категории услуг
          <span className="text-sm text-blue-600 font-normal">Все →</span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.slice(1).map((category, index) => (
            <AnimatedCard key={category.id} delay={index * 0.05}>
              <motion.div
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 text-center shadow-md border border-blue-100"
                whileHover={{ 
                  scale: 1.05,
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                  boxShadow: THEME.shadows.lg
                }}
                onClick={() => onNavigate('catalog', { category: category.id })}
              >
                <motion.div 
                  className="text-4xl mb-2"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {category.icon}
                </motion.div>
                <div className="text-sm font-semibold text-gray-800">{category.name.ru}</div>
                <div className="text-xs text-gray-500 mt-1">{category.count} услуг</div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Статистика */}
      <div className="px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, ...THEME.animations.bounce }}
                className="text-center text-white"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA блок */}
      <motion.div
        className="px-4 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-2">🌟 Специальное предложение</h3>
          <p className="mb-4 opacity-90">Забронируйте 3 экскурсии и получите 4-ю бесплатно!</p>
          <PulseButton
            variant="secondary"
            onClick={() => onNavigate('catalog')}
          >
            Выбрать экскурсии
          </PulseButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 📚 КАТАЛОГ УСЛУГ
const CatalogScreen = ({ onNavigate, category: initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredServices = useMemo(() => {
    let services = SERVICES;
    
    if (selectedCategory !== 'all') {
      services = services.filter(s => s.category === selectedCategory);
    }
    
    if (searchQuery) {
      services = services.filter(s => 
        s.name.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.ru.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    services = services.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);
    
    // Сортировка
    switch (sortBy) {
      case 'price_asc':
        services.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        services.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        services.sort((a, b) => b.rating - a.rating);
        break;
      default:
        services.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    
    return services;
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const toggleFavorite = (serviceId) => {
    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const ServiceCard = ({ service, index }) => {
    const isFavorite = favorites.includes(service.id);
    
    return (
      <AnimatedCard delay={index * 0.05}>
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          whileHover={{ y: -8, boxShadow: THEME.shadows.lg }}
        >
          <div className="relative">
            <img 
              src={service.images[0]} 
              alt={service.name.ru}
              className="w-full h-48 object-cover"
            />
            {service.oldPrice && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                -{Math.round((1 - service.price / service.oldPrice) * 100)}%
              </motion.div>
            )}
            <motion.button
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(service.id);
              }}
            >
              <motion.span
                animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
              >
                {isFavorite ? '❤️' : '🤍'}
              </motion.span>
            </motion.button>
            {service.instantBooking && (
              <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <span>⚡</span> Мгновенное подтверждение
              </div>
            )}
          </div>
          
          <div className="p-4">
            {service.tags && (
              <div className="flex gap-2 mb-2">
                {service.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h3 className="font-bold text-lg mb-1">{service.name.ru}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description.ru}</p>
            
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span>⏱️</span> {Math.floor(service.duration / 60)}ч
              </span>
              <span className="flex items-center gap-1">
                <span>⭐</span> {service.rating} ({service.reviewsCount})
              </span>
              {service.availableSlots && (
                <span className="flex items-center gap-1 text-green-600">
                  <span>✅</span> {service.availableSlots} мест
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                {service.oldPrice && (
                  <span className="text-gray-400 line-through text-sm mr-2">
                    {service.oldPrice} {service.currency}
                  </span>
                )}
                <span className="text-2xl font-bold text-blue-600">
                  {service.price} {service.currency}
                </span>
              </div>
              <PulseButton
                size="sm"
                onClick={() => onNavigate('service', { serviceId: service.id })}
              >
                Подробнее
              </PulseButton>
            </div>
          </div>
        </motion.div>
      </AnimatedCard>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка с поиском */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск услуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-3.5 text-gray-500">🔍</span>
            <motion.button
              className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="text-sm">⚙️</span>
            </motion.button>
          </div>
        </div>
        
        {/* Категории */}
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name.ru}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ценовой диапазон: {priceRange[0]} - {priceRange[1]} AED
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Сортировка</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="popular">По популярности</option>
                  <option value="price_asc">Цена: по возрастанию</option>
                  <option value="price_desc">Цена: по убыванию</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Результаты */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            Найдено: {filteredServices.length} услуг
          </h2>
          <motion.button
            className="text-blue-600 font-medium"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setPriceRange([0, 5000]);
              setSortBy('popular');
            }}
          >
            Сбросить
          </motion.button>
        </div>

        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </motion.div>
        ) : (
          <div className="space-y-4 pb-20">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 ДЕТАЛЬНАЯ СТРАНИЦА УСЛУГИ
const ServiceDetailScreen = ({ serviceId, onNavigate }) => {
  const service = SERVICES.find(s => s.id === serviceId);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  if (!service) return null;

  const totalPrice = service.price * (adults + children * 0.7);
  
  const availableDates = ['2025-02-01', '2025-02-02', '2025-02-03', '2025-02-04', '2025-02-05'];
  const availableTimes = ['09:00', '11:00', '14:00', '16:00', '18:00'];

  const features = [
    { icon: '✅', text: 'Мгновенное подтверждение' },
    { icon: '💳', text: 'Безопасная оплата' },
    { icon: '🔄', text: 'Бесплатная отмена за 24ч' },
    { icon: '👥', text: 'Профессиональные гиды' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Галерея изображений */}
      <div className="relative">
        <motion.img
          src={service.images[0]}
          alt={service.name.ru}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.button
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('catalog')}
        >
          <span className="text-xl">←</span>
        </motion.button>
        <motion.button
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowGallery(true)}
        >
          <span>📸</span>
          <span className="text-sm font-medium">Все фото</span>
        </motion.button>
      </div>

      <div className="p-4">
        {/* Основная информация */}
        <AnimatedCard>
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold flex-1">{service.name.ru}</h1>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {service.price} {service.currency}
                </div>
                <div className="text-sm text-gray-500">за человека</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <span>⏱️</span> {Math.floor(service.duration / 60)}ч
              </span>
              <span className="flex items-center gap-1">
                <span>⭐</span> {service.rating} ({service.reviewsCount} отзывов)
              </span>
              <span className="flex items-center gap-1">
                <span>📍</span> Дубай
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{service.description.ru}</p>
          </div>
        </AnimatedCard>

        {/* Преимущества */}
        <AnimatedCard delay={0.1}>
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h3 className="font-bold text-lg mb-3">Преимущества</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Форма бронирования */}
        <AnimatedCard delay={0.2}>
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h3 className="font-bold text-lg mb-4">Выберите параметры</h3>
            
            {/* Выбор даты */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Дата</label>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map(date => (
                  <motion.button
                    key={date}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      selectedDate === date
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                  >
                    {new Date(date).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Выбор времени */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <label className="text-sm font-medium text-gray-700 mb-2 block">Время</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableTimes.map(time => (
                    <motion.button
                      key={time}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Количество участников */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Взрослые</label>
                <div className="flex items-center gap-3">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    −
                  </motion.button>
                  <span className="text-xl font-semibold w-8 text-center">{adults}</span>
                  <motion.button
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAdults(adults + 1)}
                  >
                    +
                  </motion.button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Дети</label>
                <div className="flex items-center gap-3">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    −
                  </motion.button>
                  <span className="text-xl font-semibold w-8 text-center">{children}</span>
                  <motion.button
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setChildren(children + 1)}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Итоговая цена */}
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Взрослые: {adults} × {service.price} AED</span>
                <span className="font-medium">{adults * service.price} AED</span>
              </div>
              {children > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Дети: {children} × {service.price * 0.7} AED</span>
                  <span className="font-medium">{(children * service.price * 0.7).toFixed(0)} AED</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Итого:</span>
                <span className="text-blue-600">{totalPrice.toFixed(0)} AED</span>
              </div>
            </div>

            <PulseButton
              size="lg"
              className="w-full"
              onClick={() => {
                if (selectedDate && selectedTime) {
                  onNavigate('booking', {
                    serviceId,
                    date: selectedDate,
                    time: selectedTime,
                    adults,
                    children,
                    totalPrice
                  });
                }
              }}
              disabled={!selectedDate || !selectedTime}
            >
              Забронировать
            </PulseButton>
          </div>
        </AnimatedCard>

        {/* Отзывы */}
        <AnimatedCard delay={0.3}>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold text-lg mb-4">Отзывы ({service.reviewsCount})</h3>
            <div className="space-y-3">
              {[
                { name: 'Анна С.', rating: 5, comment: 'Отличная экскурсия! Гид был очень профессиональным.', date: '2 дня назад' },
                { name: 'Михаил Д.', rating: 5, comment: 'Все понравилось, рекомендую!', date: '5 дней назад' },
                { name: 'Елена П.', rating: 4, comment: 'Хорошая организация, но немного дороговато.', date: '1 неделю назад' }
              ].map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-b last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{review.name}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
};

// 📝 ЭКРАН БРОНИРОВАНИЯ
const BookingScreen = ({ bookingData, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    hotel: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const service = SERVICES.find(s => s.id === bookingData.serviceId);
  const steps = ['Контакты', 'Оплата', 'Подтверждение'];

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Шапка с прогрессом */}
      <div className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevStep}
            className="text-xl"
          >
            ←
          </motion.button>
          <h1 className="text-lg font-bold">Оформление заказа</h1>
          <div className="w-6" />
        </div>
        
        {/* Прогресс бар */}
        <div className="flex items-center justify-between">
          {steps.map((stepName, index) => (
            <div key={index} className="flex-1">
              <div className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={{ scale: index + 1 === step ? 1.2 : 1 }}
                >
                  {index + 1}
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    className="flex-1 h-1 mx-2"
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: index + 1 < step ? 1 : 0,
                      backgroundColor: index + 1 < step ? '#2563eb' : '#e5e7eb'
                    }}
                    style={{ originX: 0 }}
                  />
                )}
              </div>
              <div className="text-xs mt-1">{stepName}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Информация о заказе */}
        <AnimatedCard>
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <h3 className="font-bold mb-3">Детали заказа</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Услуга:</span>
                <span className="font-medium">{service?.name.ru}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дата:</span>
                <span className="font-medium">{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Время:</span>
                <span className="font-medium">{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Участники:</span>
                <span className="font-medium">
                  {bookingData.adults} взр. {bookingData.children > 0 && `+ ${bookingData.children} дет.`}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-blue-600">{bookingData.totalPrice} AED</span>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Контент в зависимости от шага */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <AnimatedCard>
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <h3 className="font-bold text-lg mb-4">Контактная информация</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Имя и фамилия</label>
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Телефон</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+971 50 123 4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Отель / Адрес для трансфера</label>
                      <input
                        type="text"
                        value={contactInfo.hotel}
                        onChange={(e) => setContactInfo({...contactInfo, hotel: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Atlantis The Palm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Особые пожелания</label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Например: вегетарианская еда, детское кресло..."
                      />
                    </div>
                  </div>
                  
                  <PulseButton
                    size="lg"
                    className="w-full mt-6"
                    onClick={handleNextStep}
                    disabled={!contactInfo.name || !contactInfo.phone || !contactInfo.email}
                  >
                    Далее к оплате
                  </PulseButton>
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <AnimatedCard>
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <h3 className="font-bold text-lg mb-4">Способ оплаты</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'card', name: 'Банковская карта', icon: '💳' },
                      { id: 'paypal', name: 'PayPal', icon: '🅿️' },
                      { id: 'cash', name: 'Наличные при встрече', icon: '💵' }
                    ].map(method => (
                      <motion.button
                        key={method.id}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          paymentMethod === method.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                        {paymentMethod === method.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-blue-600"
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6"
                    >
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-3">
                          Вы будете перенаправлены на защищенную страницу оплаты
                        </p>
                        <div className="flex gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        Я согласен с условиями бронирования и политикой отмены
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 border-2 border-gray-300 rounded-full font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePrevStep}
                    >
                      Назад
                    </motion.button>
                    <PulseButton
                      size="lg"
                      className="flex-1"
                      onClick={handleNextStep}
                      disabled={!agreedToTerms}
                    >
                      Оплатить {bookingData.totalPrice} AED
                    </PulseButton>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, ...THEME.animations.bounce }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-white text-5xl">✓</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                Заказ успешно оформлен!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Номер заказа: #BK-2025-0001234
              </motion.p>

              <AnimatedCard delay={0.5}>
                <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="font-medium">Подтверждение отправлено</p>
                        <p className="text-sm text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="font-medium">SMS с деталями</p>
                        <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎫</span>
                      <div>
                        <p className="font-medium">Ваучер готов</p>
                        <p className="text-sm text-gray-600">Покажите его при встрече</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <div className="space-y-3">
                <PulseButton
                  size="lg"
                  className="w-full"
                  onClick={() => onNavigate('bookings')}
                >
                  Посмотреть мои заказы
                </PulseButton>
                <motion.button
                  className="w-full py-3 font-medium text-gray-600"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate('home')}
                >
                  На главную
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// 🎫 МОИ БРОНИРОВАНИЯ
const BookingsScreen = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const bookings = [
    {
      id: 'BK-2025-0001234',
      service: SERVICES[0],
      date: '2025-02-01',
      time: '09:00',
      status: 'confirmed',
      participants: { adults: 2, children: 1 },
      totalAmount: 750
    },
    {
      id: 'BK-2025-0001235',
      service: SERVICES[2],
      date: '2025-02-05',
      time: '14:00',
      status: 'pending',
      participants: { adults: 4, children: 0 },
      totalAmount: 1500
    }
  ];

  const tabs = [
    { id: 'upcoming', label: 'Предстоящие', count: 2 },
    { id: 'past', label: 'Прошедшие', count: 5 },
    { id: 'cancelled', label: 'Отмененные', count: 0 }
  ];

  const statusConfig = {
    confirmed: { label: 'Подтверждено', color: 'green', icon: '✅' },
    pending: { label: 'Ожидает оплаты', color: 'yellow', icon: '⏳' },
    cancelled: { label: 'Отменено', color: 'red', icon: '❌' }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-4">Мои бронирования</h1>
        
        <div className="flex gap-2">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'upcoming' && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <AnimatedCard key={booking.id} delay={index * 0.1}>
                <motion.div
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                  whileHover={{ y: -4, boxShadow: THEME.shadows.lg }}
                >
                  <div className="flex">
                    <img
                      src={booking.service.images[0]}
                      alt={booking.service.name.ru}
                      className="w-32 h-32 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg flex-1">{booking.service.name.ru}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig[booking.status].color}-100 text-${statusConfig[booking.status].color}-600 flex items-center gap-1`}>
                          <span>{statusConfig[booking.status].icon}</span>
                          {statusConfig[booking.status].label}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(booking.date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{booking.participants.adults} взрослых</span>
                          {booking.participants.children > 0 && (
                            <span>+ {booking.participants.children} детей</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="font-medium">{booking.totalAmount} AED</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Посмотреть ваучер
                        </motion.button>
                        {booking.status === 'pending' && (
                          <motion.button
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Оплатить
                          </motion.button>
                        )}
                        <motion.button
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Отменить
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Нет бронирований</h3>
            <p className="text-gray-600 mb-4">Самое время забронировать незабываемое приключение!</p>
            <PulseButton onClick={() => onNavigate('catalog')}>
              Посмотреть услуги
            </PulseButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 💬 AI ЧАТ-БОТ
const ChatBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Привет! Я ваш персональный помощник по турам в ОАЭ. Чем могу помочь?' }
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'Популярные экскурсии',
    'Парки развлечений',
    'Что посмотреть в Дубае?',
    'Семейный отдых'
  ];

  const sendMessage = (text) => {
    const userMessage = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Имитация ответа бота
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Отличный выбор! Я подобрал для вас лучшие варианты...'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Кнопка чата */}
      <motion.button
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Окно чата */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-36 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Шапка чата */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold">AI Помощник</h3>
                  <p className="text-xs opacity-80">Всегда онлайн</p>
                </div>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Быстрые ответы */}
            <div className="p-2 border-t">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(reply)}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Поле ввода */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && inputText && sendMessage(inputText)}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
                />
                <motion.button
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => inputText && sendMessage(inputText)}
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 🎯 ГЛАВНОЕ ПРИЛОЖЕНИЕ
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenData, setScreenData] = useState({});
  const { webApp } = useTelegram();

  const navigate = (screen, data = {}) => {
    setCurrentScreen(screen);
    setScreenData(data);
    // Haptic feedback
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
  };

  const screens = {
    home: <HomeScreen onNavigate={navigate} />,
    catalog: <CatalogScreen onNavigate={navigate} {...screenData} />,
    service: <ServiceDetailScreen onNavigate={navigate} {...screenData} />,
    booking: <BookingScreen onNavigate={navigate} bookingData={screenData} />,
    bookings: <BookingsScreen onNavigate={navigate} />,
    favorites: (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-xl font-bold mb-2">Избранное</h2>
          <p className="text-gray-600">Здесь будут ваши любимые услуги</p>
        </div>
      </div>
    ),
    promos: (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-xl font-bold mb-2">Акции и скидки</h2>
          <p className="text-gray-600">Специальные предложения для вас</p>
        </div>
      </div>
    ),
    support: (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-bold mb-2">Поддержка</h2>
          <p className="text-gray-600">Мы всегда готовы помочь!</p>
          <div className="mt-4 space-y-2">
            <a href="tel:+971501234567" className="block text-blue-600 font-medium">📞 +971 50 123 4567</a>
            <a href="https://wa.me/971501234567" className="block text-green-600 font-medium">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {screens[currentScreen]}
        </motion.div>
      </AnimatePresence>

      {/* Нижняя навигация */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, ...THEME.animations.spring }}
      >
        <div className="flex justify-around items-center py-2">
          {[
            { id: 'home', icon: '🏠', label: 'Главная' },
            { id: 'catalog', icon: '🎯', label: 'Каталог' },
            { id: 'bookings', icon: '🎫', label: 'Заказы' },
            { id: 'favorites', icon: '❤️', label: 'Избранное' }
          ].map((item) => (
            <motion.button
              key={item.id}
              className={`flex flex-col items-center justify-center p-2 flex-1 ${
                currentScreen === item.id ? 'text-blue-600' : 'text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.id)}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI Чат-бот */}
      <ChatBotButton />
    </div>
  );
}