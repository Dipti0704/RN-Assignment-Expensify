export const Colors = {
  // Primary - Black & Gold theme
  primary: '#544c4cff',        // Pure Black
  primaryLight: '#1F1F1F',   // Dark Gray
  primaryDark: '#151414ff',
  
  // Secondary - Gold accent
  secondary: '#FFD700',      // Gold
  secondaryLight: '#FFF4CC', // Light Gold
  
  // Neutrals
  background: '#0A0A0A',     // Almost Black
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays
  gray: '#9CA3AF',
  grayLight: '#2D2D2D',
  grayDark: '#171717',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Category colors - Updated for dark theme
  categories: {
    Food: { 
      bg: '#2D1B1B', 
      icon: '#FF6B6B', 
      color: '#FF6B6B' 
    },
    Transport: { 
      bg: '#1B2D1F', 
      icon: '#4ECDC4', 
      color: '#4ECDC4' 
    },
    Shopping: { 
      bg: '#1B1B2D', 
      icon: '#95A5F6', 
      color: '#95A5F6' 
    },
    Entertainment: { 
      bg: '#2D1B2D', 
      icon: '#F78FB3', 
      color: '#F78FB3' 
    },
    Bills: { 
      bg: '#2D2B1B', 
      icon: '#FFB84D', 
      color: '#FFB84D' 
    },
    Health: { 
      bg: '#1B2D2D', 
      icon: '#4DD4F7', 
      color: '#4DD4F7' 
    },
    Education: { 
      bg: '#251B2D', 
      icon: '#B794F6', 
      color: '#B794F6' 
    },
    Other: { 
      bg: '#2D2D2D', 
      icon: '#9CA3AF', 
      color: '#9CA3AF' 
    }
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 9999
};

export const Shadows = {
  small: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
};