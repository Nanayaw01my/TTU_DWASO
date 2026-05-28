export const formatPrice = (price) =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(price);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
};

export const getInstitutionBadgeClass = (type) => {
  const map = {
    UNIVERSITY: 'badge-university',
    NURSING: 'badge-nursing',
    TEACHER: 'badge-teacher',
  };
  return map[type] || 'badge-university';
};

export const getInstitutionLabel = (type) => {
  const map = {
    UNIVERSITY: 'University',
    NURSING: 'Nursing College',
    TEACHER: 'Teacher Training',
  };
  return map[type] || type;
};

export const PRODUCT_CATEGORIES = [
  'Books',
  'Electronics',
  'Furniture',
  'Clothes',
  'Food',
  'Nursing/Medical Supplies',
  'Teaching Materials',
  'Others',
];

export const PRODUCT_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export const truncateText = (text, maxLen = 100) =>
  text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
