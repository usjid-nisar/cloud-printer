import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import Color from 'color';

const prisma = new PrismaClient();

export interface BrandingTheme {
  [key: string]: any;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  logo?: {
    url: string;
    width: number;
    height: number;
  };
}

interface BrandingData {
  logo?: {
    url: string;
    width: number;
    height: number;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    primary?: string;
    secondary?: string;
  };
  layout?: {
    headerStyle?: 'centered' | 'left-aligned';
    navigationStyle?: 'top' | 'side';
  };
}

export class BrandingService {
  async generateTheme(brandingData: any): Promise<BrandingTheme> {
    try {
      const theme: BrandingTheme = {
        colors: {
          primary: brandingData.primaryColor || '#000000',
          secondary: brandingData.secondaryColor || '#FFFFFF',
          accent: brandingData.accentColor || '#0066CC',
          background: brandingData.backgroundColor || '#F5F5F5',
          text: brandingData.textColor || '#333333'
        },
        fonts: {
          primary: brandingData.primaryFont || 'Arial',
          secondary: brandingData.secondaryFont || 'Helvetica'
        }
      };

      if (brandingData.logo) {
        theme.logo = {
          url: brandingData.logo.url,
          width: brandingData.logo.width || 200,
          height: brandingData.logo.height || 60
        };
      }

      return theme;
    } catch (error) {
      logger.error('Failed to generate theme:', error);
      throw new AppError('Failed to generate theme', 500);
    }
  }

  private processColors(colors: BrandingData['colors'] = {}) {
    const processedColors = {
      primary: this.sanitizeColor(colors.primary || '#1a73e8'),
      secondary: this.sanitizeColor(colors.secondary || '#4285f4'),
      accent: this.sanitizeColor(colors.accent || '#fbbc04'),
      background: this.sanitizeColor(colors.background || '#ffffff'),
      text: this.sanitizeColor(colors.text || '#202124'),
    };

    // Generate additional color variants
    const primaryColor = Color(processedColors.primary);
    
    return {
      colors: {
        ...processedColors,
        primaryLight: primaryColor.lighten(0.2).hex(),
        primaryDark: primaryColor.darken(0.2).hex(),
        primaryTransparent: primaryColor.alpha(0.1).rgb().string(),
        textMuted: Color(processedColors.text).alpha(0.6).rgb().string(),
        border: Color(processedColors.text).alpha(0.1).rgb().string(),
      },
    };
  }

  private processFonts(fonts: BrandingData['fonts'] = {}) {
    const defaultFonts = {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'SF Pro Display, system-ui, sans-serif',
    };

    return {
      typography: {
        primaryFont: this.sanitizeFontFamily(fonts.primary) || defaultFonts.primary,
        secondaryFont: this.sanitizeFontFamily(fonts.secondary) || defaultFonts.secondary,
        scale: {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.75rem',
          h4: '1.5rem',
          body: '1rem',
          small: '0.875rem',
        },
      },
    };
  }

  private processLayout(layout: BrandingData['layout'] = {}) {
    return {
      layout: {
        headerStyle: layout.headerStyle || 'centered',
        navigationStyle: layout.navigationStyle || 'top',
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '1rem',
          full: '9999px',
        },
      },
    };
  }

  private processLogo(logo: BrandingData['logo']) {
    if (!logo) {
      return {
        logo: {
          url: null,
          aspectRatio: null,
        },
      };
    }

    return {
      logo: {
        url: this.sanitizeUrl(logo.url),
        aspectRatio: logo.width / logo.height,
      },
    };
  }

  private validateAndEnhanceTheme(theme: any) {
    // Add component-specific styles
    return {
      ...theme,
      components: {
        button: this.generateButtonStyles(theme),
        input: this.generateInputStyles(theme),
        card: this.generateCardStyles(theme),
        table: this.generateTableStyles(theme),
      },
      // Add responsive breakpoints
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      // Add animations
      animations: {
        transition: {
          fast: '150ms ease-in-out',
          normal: '250ms ease-in-out',
          slow: '350ms ease-in-out',
        },
      },
    };
  }

  private generateButtonStyles(theme: any) {
    return {
      primary: {
        backgroundColor: theme.colors.primary,
        color: '#ffffff',
        hoverBackgroundColor: theme.colors.primaryDark,
        padding: `${theme.layout.spacing.sm} ${theme.layout.spacing.md}`,
        borderRadius: theme.layout.borderRadius.md,
        fontFamily: theme.typography.primaryFont,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
        hoverBackgroundColor: theme.colors.primaryTransparent,
        padding: `${theme.layout.spacing.sm} ${theme.layout.spacing.md}`,
        borderRadius: theme.layout.borderRadius.md,
        fontFamily: theme.typography.primaryFont,
      },
    };
  }

  private generateInputStyles(theme: any) {
    return {
      backgroundColor: '#ffffff',
      borderColor: theme.colors.border,
      focusBorderColor: theme.colors.primary,
      borderRadius: theme.layout.borderRadius.md,
      padding: theme.layout.spacing.sm,
      fontFamily: theme.typography.primaryFont,
      fontSize: theme.typography.scale.body,
    };
  }

  private generateCardStyles(theme: any) {
    return {
      backgroundColor: '#ffffff',
      borderRadius: theme.layout.borderRadius.lg,
      padding: theme.layout.spacing.lg,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    };
  }

  private generateTableStyles(theme: any) {
    return {
      header: {
        backgroundColor: theme.colors.primaryTransparent,
        color: theme.colors.text,
        fontFamily: theme.typography.primaryFont,
        fontWeight: 600,
      },
      cell: {
        padding: theme.layout.spacing.sm,
        borderColor: theme.colors.border,
      },
      row: {
        hoverBackgroundColor: Color(theme.colors.primary).alpha(0.05).rgb().string(),
      },
    };
  }

  private sanitizeColor(color: string | undefined): string {
    if (!color) return '#000000';
    try {
      return Color(color).hex();
    } catch {
      return '#000000';
    }
  }

  private sanitizeFontFamily(font: string | undefined): string | null {
    if (!font) return null;
    // Remove potentially harmful characters
    return font.replace(/[^a-zA-Z0-9\s,-]/g, '');
  }

  private sanitizeUrl(url: string | undefined): string | null {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch {
      return null;
    }
  }
} 