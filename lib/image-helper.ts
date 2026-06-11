/**
 * Image helper to fetch curated high-quality mock images for products and stores.
 * This ensures the app feels alive and polished rather than using dry wireframe icons.
 */

const PRODUCT_IMAGES = {
  phone: {
    iphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&auto=format&fit=crop",
    samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80&auto=format&fit=crop",
    pixel: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80&auto=format&fit=crop",
  },
  electronics: {
    laptop: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=400&q=80&auto=format&fit=crop",
    macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80&auto=format&fit=crop",
    headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&auto=format&fit=crop",
    watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop",
    camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400&q=80&auto=format&fit=crop",
  },
  cloth: {
    shirt: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80&auto=format&fit=crop",
    tshirt: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80&auto=format&fit=crop",
    hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80&auto=format&fit=crop",
    shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
    sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
    jacket: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80&auto=format&fit=crop",
  },
  cosmetics: {
    perfume: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80&auto=format&fit=crop",
    skincare: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format&fit=crop",
    cream: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80&auto=format&fit=crop",
    makeup: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80&auto=format&fit=crop",
  },
  general: {
    default: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80&auto=format&fit=crop",
  },
};

const STORE_IMAGES = {
  phone: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=300&q=80&auto=format&fit=crop",
  electronics: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80&auto=format&fit=crop",
  cloth: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80&auto=format&fit=crop",
  cosmetics: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=80&auto=format&fit=crop",
};

export function getProductImage(name: string, category: string): string {
  const normName = name.toLowerCase();
  const cat = category.toLowerCase() as keyof typeof PRODUCT_IMAGES;

  if (PRODUCT_IMAGES[cat]) {
    const subCategory = PRODUCT_IMAGES[cat] as Record<string, string>;
    for (const key of Object.keys(subCategory)) {
      if (normName.includes(key)) {
        return subCategory[key];
      }
    }
    return subCategory.default;
  }

  // Check general match
  for (const catName of Object.keys(PRODUCT_IMAGES)) {
    const subCategory = PRODUCT_IMAGES[catName as keyof typeof PRODUCT_IMAGES] as Record<string, string>;
    if (normName.includes(catName)) {
      return subCategory.default;
    }
  }

  return PRODUCT_IMAGES.general.default;
}

export function getStoreImage(name: string, category: string): string {
  const normName = name.toLowerCase();
  const normCat = category.toLowerCase() as keyof typeof STORE_IMAGES;

  if (STORE_IMAGES[normCat]) {
    return STORE_IMAGES[normCat];
  }

  for (const key of Object.keys(STORE_IMAGES)) {
    if (normName.includes(key)) {
      return STORE_IMAGES[key as keyof typeof STORE_IMAGES];
    }
  }

  return STORE_IMAGES.default;
}
