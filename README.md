# Node.js Contact Manager - HW3 CRUD

Bu proje, Node.js ile geliştirilmiş bir iletişim yönetim uygulamasıdır. Uygulama, MongoDB veritabanı kullanarak kişilerin iletişim bilgilerini saklar ve RESTful API üzerinden yönetilmesini sağlar.  

## Özellikler

- **Tüm iletişimleri listeleme:** `GET /contacts`  
- **Tek bir iletişimi görüntüleme:** `GET /contacts/:id`  
- **Yeni iletişim ekleme:** `POST /contacts`  
- **Mevcut iletişimi güncelleme:** `PATCH /contacts/:id`  
- **İletişimi silme:** `DELETE /contacts/:id`  
- **Hata yönetimi ve doğrulama:** HTTP hataları ve Joi şema doğrulaması ile güvenli veri yönetimi  

## Kullanım

1. Projeyi klonlayın ve gerekli bağımlılıkları yükleyin:  
```bash
npm install
