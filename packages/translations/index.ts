// @gv/translations

export const dictionaries = {
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      cancel: 'Cancel',
      confirm: 'Confirm',
      submit: 'Submit',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      loading: 'Loading...',
      success: 'Operation completed successfully',
      error: 'An error occurred',
      actions: 'Actions',
      name: 'Name',
      email: 'Email',
      password: 'Password',
    },
    validation: {
      emailInvalid: 'Invalid email address',
      passwordTooShort: 'Password must be at least 8 characters long',
      nameTooShort: 'Name must be at least 2 characters long',
      requiredField: 'This field is required',
    },
    auth: {
      unauthorized: 'You are not authorized to access this resource',
      sessionExpired: 'Your session has expired. Please log in again',
      loginFailed: 'Invalid email or password',
    },
    products: {
      name: 'Product Name',
      price: 'Price',
      stock: 'Stock Quantity',
      description: 'Description',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      listProducts: 'Product List',
      outOfStock: 'Out of stock',
      inStock: 'In stock',
      noProducts: 'No products found',
      createSuccess: 'Product created successfully',
      updateSuccess: 'Product updated successfully',
      deleteSuccess: 'Product deleted successfully',
    },
    images: {
      uploadImage: 'Upload Image',
      uploading: 'Uploading image...',
      uploadSuccess: 'Image uploaded successfully',
      deleteSuccess: 'Image deleted successfully',
      invalidType: 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are supported',
      tooLarge: 'Image is too large. Maximum size is 5MB',
    },
  },
  ar: {
    common: {
      welcome: 'مرحباً',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      register: 'تسجيل جديد',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      submit: 'إرسال',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      create: 'إنشاء',
      loading: 'جاري التحميل...',
      success: 'تمت العملية بنجاح',
      error: 'حدث خطأ ما',
      actions: 'الإجراءات',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
    },
    validation: {
      emailInvalid: 'البريد الإلكتروني غير صالح',
      passwordTooShort: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
      nameTooShort: 'يجب أن يتكون الاسم من حرفين على الأقل',
      requiredField: 'هذا الحقل مطلوب',
    },
    auth: {
      unauthorized: 'غير مصرح لك بالوصول إلى هذا المورد',
      sessionExpired: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى',
      loginFailed: 'البريد الإلكتروني أو كلمة المرور غير صالحة',
    },
    products: {
      name: 'اسم المنتج',
      price: 'السعر',
      stock: 'الكمية المتوفرة',
      description: 'الوصف',
      addProduct: 'إضافة منتج',
      editProduct: 'تعديل المنتج',
      deleteProduct: 'حذف المنتج',
      listProducts: 'قائمة المنتجات',
      outOfStock: 'نفذت الكمية',
      inStock: 'متوفر',
      noProducts: 'لم يتم العثور على منتجات',
      createSuccess: 'تم إنشاء المنتج بنجاح',
      updateSuccess: 'تم تحديث المنتج بنجاح',
      deleteSuccess: 'تم حذف المنتج بنجاح',
    },
    images: {
      uploadImage: 'رفع صورة',
      uploading: 'جاري رفع الصورة...',
      uploadSuccess: 'تم رفع الصورة بنجاح',
      deleteSuccess: 'تم حذف الصورة بنجاح',
      invalidType: 'نوع الملف غير صالح. يتم دعم ملفات JPEG و PNG و WEBP و GIF و SVG فقط',
      tooLarge: 'حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت',
    },
  },
};

export type Language = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)['en'];
export type Namespace = keyof Dictionary;

// Compile-time safe nested key autocompletion
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<Dictionary>;

export function getTranslation(lang: Language, key: TranslationKey): string {
  const parts = key.split('.');
  let current: unknown = dictionaries[lang];

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to English
      let enFallback: unknown = dictionaries['en'];
      for (const enPart of parts) {
        if (enFallback && typeof enFallback === 'object' && enPart in enFallback) {
          enFallback = (enFallback as Record<string, unknown>)[enPart];
        } else {
          return key;
        }
      }
      return typeof enFallback === 'string' ? enFallback : key;
    }
  }

  return typeof current === 'string' ? current : key;
}
