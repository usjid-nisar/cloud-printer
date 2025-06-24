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
export declare class BrandingService {
    generateTheme(brandingData: any): Promise<BrandingTheme>;
    private processColors;
    private processFonts;
    private processLayout;
    private processLogo;
    private validateAndEnhanceTheme;
    private generateButtonStyles;
    private generateInputStyles;
    private generateCardStyles;
    private generateTableStyles;
    private sanitizeColor;
    private sanitizeFontFamily;
    private sanitizeUrl;
}
