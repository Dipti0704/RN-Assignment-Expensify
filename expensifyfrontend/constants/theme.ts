export const Colors = {
  // Primary - Teal/Cyan gradient theme
  primary: '#14B8A6',
  primaryLight: '#99F6E4',
  primaryDark: '#0D9488',
  
  // Secondary - Orange accent
  secondary: '#F97316',
  secondaryLight: '#FED7AA',
  
  // Neutrals
  background: '#F9FAFB',
  white: '#FFFFFF',
  black: '#1F2937',
  
  // Grays
  gray: '#6B7280',
  grayLight: '#E5E7EB',
  grayDark: '#374151',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Category colors - Different from PocketExpense+
  categories: {
    Food: { 
      bg: '#FEE2E2', 
      icon: '#EF4444', 
      color: '#DC2626' 
    },
    Transport: { 
      bg: '#D1FAE5', 
      icon: '#10B981', 
      color: '#059669' 
    },
    Shopping: { 
      bg: '#DBEAFE', 
      icon: '#3B82F6', 
      color: '#2563EB' 
    },
    Entertainment: { 
      bg: '#FCE7F3', 
      icon: '#EC4899', 
      color: '#DB2777' 
    },
    Bills: { 
      bg: '#FEF3C7', 
      icon: '#F59E0B', 
      color: '#D97706' 
    },
    Health: { 
      bg: '#CFFAFE', 
      icon: '#06B6D4', 
      color: '#0891B2' 
    },
    Education: { 
      bg: '#EDE9FE', 
      icon: '#8B5CF6', 
      color: '#7C3AED' 
    },
    Other: { 
      bg: '#F3F4F6', 
      icon: '#9CA3AF', 
      color: '#6B7280' 
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  }
};