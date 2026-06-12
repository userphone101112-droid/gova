# Deploy Key Setup Guide - gova

## المفتاح العام (استخدمه على GitHub)

قم بالذهاب إلى: `Settings > Deploy keys > Add deploy key`

الرابط المباشر: https://github.com/userphone101112-droid/gova/settings/keys

أضف المفتاح العام التالي:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDf2V5QqX1MlNsLR+mas0J/bLMVhIf2x4/EUFQBB1EO2 hesham@DESKTOP-UA52GFH
```

**اجعل Allow write access مفعلة** للسماح بـ push

---

## خطوات الاستخدام:

### 1. تشغيل سكريبت الإعداد التلقائي:

```powershell
.\setup-deploy-key.ps1 -Setup
```

### 2. تعديل git remote لاستخدام المفتاح (يتم تلقائياً بالسكريبت):

```powershell
# قم بتعديل الـ remote URL
git remote set-url origin "git@github.com-gova:userphone101112-droid/gova.git"

# إذا أردت العودة للـ HTTPS
git remote set-url origin "https://github.com/userphone101112-droid/gova.git"
```

### 3. اختبر الاتصال:

```powershell
.\setup-deploy-key.ps1 -Test
# أو مباشرة:
ssh -T git@github.com-gova
```

---

## الملفات المستخدمة:

- `.git_deploy_key` - المفتاح الخاص (آمن - لا تشاركه)
- `.git_deploy_key.pub` - المفتاح العام (أضفه على GitHub)
- `.ssh_config` - تكوين SSH محلي

---

## ملاحظات أمان:

- ✅ المفاتيح محفوظة محلياً في المشروع
- ✅ لا تحتاج لإعدادات Windows العامة
- ✅ يمكنك نسخ المشروع على أي جهاز وسيعمل مباشرة
- ⚠️ تأكد من عدم مشاركة المفتاح الخاص `.git_deploy_key`
- ⚠️ المفاتيح مضافة بالفعل إلى `.gitignore`
