import { z } from 'zod';
export declare const createPartnerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    domain: z.ZodOptional<z.ZodString>;
    selfProduce: z.ZodOptional<z.ZodBoolean>;
    brandingSettings: z.ZodObject<{
        logo: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            url: string;
            width: number;
            height: number;
        }, {
            url: string;
            width: number;
            height: number;
        }>>;
        colors: z.ZodOptional<z.ZodObject<{
            primary: z.ZodString;
            secondary: z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        }, {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        }>>;
        fonts: z.ZodOptional<z.ZodObject<{
            heading: z.ZodString;
            body: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            heading: string;
            body: string;
        }, {
            heading: string;
            body: string;
        }>>;
        layout: z.ZodOptional<z.ZodObject<{
            headerStyle: z.ZodEnum<["minimal", "standard", "custom"]>;
            footerStyle: z.ZodEnum<["minimal", "standard", "custom"]>;
        }, "strip", z.ZodTypeAny, {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        }, {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        }>>;
    }, "strict", z.ZodTypeAny, {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    }, {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    name: string;
    email: string;
    brandingSettings: {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    };
    domain?: string | undefined;
    selfProduce?: boolean | undefined;
}, {
    name: string;
    email: string;
    brandingSettings: {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    };
    domain?: string | undefined;
    selfProduce?: boolean | undefined;
}>;
export declare const updateBrandingSchema: z.ZodObject<{
    params: z.ZodObject<{
        partnerId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        partnerId: string;
    }, {
        partnerId: string;
    }>;
    body: z.ZodObject<{
        brandingData: z.ZodObject<{
            logo: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                url: string;
                width: number;
                height: number;
            }, {
                url: string;
                width: number;
                height: number;
            }>>;
            colors: z.ZodOptional<z.ZodObject<{
                primary: z.ZodString;
                secondary: z.ZodOptional<z.ZodString>;
                accent: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            }, {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            }>>;
            fonts: z.ZodOptional<z.ZodObject<{
                heading: z.ZodString;
                body: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                heading: string;
                body: string;
            }, {
                heading: string;
                body: string;
            }>>;
            layout: z.ZodOptional<z.ZodObject<{
                headerStyle: z.ZodEnum<["minimal", "standard", "custom"]>;
                footerStyle: z.ZodEnum<["minimal", "standard", "custom"]>;
            }, "strip", z.ZodTypeAny, {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            }, {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            }>>;
        }, "strict", z.ZodTypeAny, {
            colors?: {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            } | undefined;
            fonts?: {
                heading: string;
                body: string;
            } | undefined;
            logo?: {
                url: string;
                width: number;
                height: number;
            } | undefined;
            layout?: {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            } | undefined;
        }, {
            colors?: {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            } | undefined;
            fonts?: {
                heading: string;
                body: string;
            } | undefined;
            logo?: {
                url: string;
                width: number;
                height: number;
            } | undefined;
            layout?: {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            } | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        brandingData: {
            colors?: {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            } | undefined;
            fonts?: {
                heading: string;
                body: string;
            } | undefined;
            logo?: {
                url: string;
                width: number;
                height: number;
            } | undefined;
            layout?: {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            } | undefined;
        };
    }, {
        brandingData: {
            colors?: {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            } | undefined;
            fonts?: {
                heading: string;
                body: string;
            } | undefined;
            logo?: {
                url: string;
                width: number;
                height: number;
            } | undefined;
            layout?: {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            } | undefined;
        };
    }>;
}, "strict", z.ZodTypeAny, {
    params: {
        partnerId: string;
    };
    body: {
        brandingData: {
            colors?: {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            } | undefined;
            fonts?: {
                heading: string;
                body: string;
            } | undefined;
            logo?: {
                url: string;
                width: number;
                height: number;
            } | undefined;
            layout?: {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            } | undefined;
        };
    };
}, {
    params: {
        partnerId: string;
    };
    body: {
        brandingData: {
            colors?: {
                primary: string;
                secondary?: string | undefined;
                accent?: string | undefined;
            } | undefined;
            fonts?: {
                heading: string;
                body: string;
            } | undefined;
            logo?: {
                url: string;
                width: number;
                height: number;
            } | undefined;
            layout?: {
                headerStyle: "custom" | "minimal" | "standard";
                footerStyle: "custom" | "minimal" | "standard";
            } | undefined;
        };
    };
}>;
export declare const validateDomainSchema: z.ZodObject<{
    params: z.ZodObject<{
        domain: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        domain: string;
    }, {
        domain: string;
    }>;
    body: z.ZodObject<{
        partnerId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        partnerId: string;
    }, {
        partnerId: string;
    }>;
}, "strict", z.ZodTypeAny, {
    params: {
        domain: string;
    };
    body: {
        partnerId: string;
    };
}, {
    params: {
        domain: string;
    };
    body: {
        partnerId: string;
    };
}>;
export declare const rotateApiKeySchema: z.ZodObject<{
    partnerId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    partnerId: string;
}, {
    partnerId: string;
}>;
export declare const getOnboardingStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        partnerId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        partnerId: string;
    }, {
        partnerId: string;
    }>;
}, "strict", z.ZodTypeAny, {
    params: {
        partnerId: string;
    };
}, {
    params: {
        partnerId: string;
    };
}>;
export declare const validateApiKeySchema: z.ZodObject<{
    headers: z.ZodObject<{
        'x-api-key': z.ZodString;
    }, "strict", z.ZodTypeAny, {
        'x-api-key': string;
    }, {
        'x-api-key': string;
    }>;
}, "strict", z.ZodTypeAny, {
    headers: {
        'x-api-key': string;
    };
}, {
    headers: {
        'x-api-key': string;
    };
}>;
export declare const updatePartnerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    domain: z.ZodOptional<z.ZodString>;
    selfProduce: z.ZodOptional<z.ZodBoolean>;
    brandingSettings: z.ZodOptional<z.ZodObject<{
        logo: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            url: string;
            width: number;
            height: number;
        }, {
            url: string;
            width: number;
            height: number;
        }>>;
        colors: z.ZodOptional<z.ZodObject<{
            primary: z.ZodString;
            secondary: z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        }, {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        }>>;
        fonts: z.ZodOptional<z.ZodObject<{
            heading: z.ZodString;
            body: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            heading: string;
            body: string;
        }, {
            heading: string;
            body: string;
        }>>;
        layout: z.ZodOptional<z.ZodObject<{
            headerStyle: z.ZodEnum<["minimal", "standard", "custom"]>;
            footerStyle: z.ZodEnum<["minimal", "standard", "custom"]>;
        }, "strip", z.ZodTypeAny, {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        }, {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        }>>;
    }, "strict", z.ZodTypeAny, {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    }, {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    domain?: string | undefined;
    brandingSettings?: {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    } | undefined;
    selfProduce?: boolean | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    domain?: string | undefined;
    brandingSettings?: {
        colors?: {
            primary: string;
            secondary?: string | undefined;
            accent?: string | undefined;
        } | undefined;
        fonts?: {
            heading: string;
            body: string;
        } | undefined;
        logo?: {
            url: string;
            width: number;
            height: number;
        } | undefined;
        layout?: {
            headerStyle: "custom" | "minimal" | "standard";
            footerStyle: "custom" | "minimal" | "standard";
        } | undefined;
    } | undefined;
    selfProduce?: boolean | undefined;
}>;
export declare const dnsRecordSchema: z.ZodObject<{
    type: z.ZodEnum<["CNAME", "A", "TXT"]>;
    name: z.ZodString;
    value: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: "CNAME" | "A" | "TXT";
    name: string;
    value: string;
}, {
    type: "CNAME" | "A" | "TXT";
    name: string;
    value: string;
}>;
