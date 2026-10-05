export const normalizeCity = (city) => {
    if (Array.isArray(city)) return city.find(Boolean) || "";
    return city || "";
};

export const normalizeSearchContext = (ctx, fallbackCity = "") => {
    if (!ctx || typeof ctx !== "object") return ctx;
    return {
        ...ctx,
        city: normalizeCity(ctx.city) || normalizeCity(fallbackCity),
        c_uid: ctx.c_uid || "",
    };
};

export const hasCompanyAndCity = (ctx) => !!(ctx && ctx.company_id && normalizeCity(ctx.city));