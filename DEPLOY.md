# 🚀 Hướng dẫn Deploy lên GitHub Pages

Hướng dẫn chi tiết từng bước để deploy ứng dụng NEO Education lên GitHub Pages.

## 📋 Mục lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Cấu hình GitHub Pages](#cấu-hình-github-pages)
3. [Phương pháp 1: GitHub Actions (Khuyến nghị)](#phương-pháp-1-github-actions-khuyến-nghị)
4. [Phương pháp 2: Deploy từ Local](#phương-pháp-2-deploy-từ-local)
5. [Kiểm tra và Xử lý lỗi](#kiểm-tra-và-xử-lý-lỗi)

---

## 📦 Chuẩn bị

### Yêu cầu tối thiểu:

- ✅ Repository trên GitHub (đã có: `hanitav/triet-utt`)
- ✅ Quyền write vào repository
- ✅ Code đã được commit và push lên nhánh `main`

### Kiểm tra trạng thái:

```bash
# Kiểm tra git status
git status

# Kiểm tra remote repository
git remote -v

# Kiểm tra nhánh hiện tại
git branch
```

---

## ⚙️ Cấu hình GitHub Pages

### Bước 1: Truy cập Settings

1. Vào repository: `https://github.com/hanitav/triet-utt`
2. Click tab **Settings** (ở menu trên cùng)
3. Scroll xuống phần **Pages** (ở sidebar bên trái)

### Bước 2: Cấu hình Source

Trong phần **Build and deployment**:

- **Source**: Chọn **Deploy from a branch**
- **Branch**: Chọn `gh-pages`
- **Folder**: Chọn `/ (root)`
- Click **Save**

### Bước 3: Xác nhận

Sau khi lưu, bạn sẽ thấy thông báo:
> ✅ **Your site is live at https://hanitav.github.io/triet-utt/**

> ⚠️ **Lưu ý**: Website chỉ hoạt động sau khi nhánh `gh-pages` được tạo và có nội dung.

---

## 🎯 Phương pháp 1: GitHub Actions (Khuyến nghị)

### Ưu điểm:
- ✅ Không cần cài đặt gì trên máy local
- ✅ Chạy trên cloud, không tốn tài nguyên máy
- ✅ Logs chi tiết, dễ debug
- ✅ Tự động cập nhật version

### Các bước thực hiện:

#### Bước 1: Commit code lên main (nếu chưa)

```bash
git add .
git commit -m "Update features"
git push origin main
```

#### Bước 2: Chạy GitHub Actions Workflow

1. **Vào tab Actions:**
   - Truy cập: `https://github.com/hanitav/triet-utt/actions`
   - Hoặc click tab **Actions** trong repository

2. **Chọn workflow:**
   - Ở sidebar bên trái, tìm và click **"Manual Deploy to GitHub Pages"**

3. **Chạy workflow:**
   - Click nút **"Run workflow"** ở góc phải trên
   - (Tùy chọn) Nhập commit message: `Update site` hoặc message tùy chỉnh
   - Click **"Run workflow"** màu xanh

#### Bước 3: Theo dõi quá trình

- Workflow sẽ hiển thị các bước đang chạy:
  - ✅ Checkout repository
  - ✅ Setup Node.js
  - ✅ Configure Git
  - ✅ Update version info
  - ✅ Commit changes to main
  - ✅ Deploy to gh-pages
  - ✅ Deployment summary

#### Bước 4: Kiểm tra kết quả

Sau khi workflow hoàn tất (thường 1-2 phút):

1. **Kiểm tra nhánh gh-pages:**
   - Vào **Code** → **Branches**
   - Xác nhận nhánh `gh-pages` đã được tạo/cập nhật

2. **Kiểm tra website:**
   - Mở: **https://hanitav.github.io/triet-utt/**
   - Đợi 1-2 phút nếu chưa thấy (GitHub Pages cần thời gian build)

---

## 💻 Phương pháp 2: Deploy từ Local

### Yêu cầu:

- ✅ Git đã cài đặt và cấu hình
- ✅ Node.js đã cài đặt (để chạy `update_version.js`)
- ✅ Đã đăng nhập Git và có quyền push

### Các bước thực hiện:

#### Bước 1: Cài đặt Node.js (nếu chưa có)

Kiểm tra:
```bash
node --version
```

Nếu chưa có, tải từ: https://nodejs.org/

#### Bước 2: Commit code (nếu có thay đổi)

```bash
# Kiểm tra thay đổi
git status

# Thêm tất cả thay đổi
git add .

# Commit
git commit -m "Update features"

# Push lên main
git push origin main
```

#### Bước 3: Chạy script deploy

**Windows (PowerShell hoặc CMD):**
```cmd
deploy.cmd "Update site"
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh "Update site"
```

#### Bước 4: Script sẽ tự động:

1. ✅ Cập nhật version info (`update_version.js`)
2. ✅ Pull latest changes từ main
3. ✅ Commit và push lên nhánh `main`
4. ✅ Chuyển sang nhánh `gh-pages`
5. ✅ Merge `main` vào `gh-pages`
6. ✅ Push lên GitHub
7. ✅ Chuyển lại về nhánh `main`

#### Bước 5: Kiểm tra kết quả

Tương tự như Phương pháp 1, kiểm tra:
- Nhánh `gh-pages` đã được tạo/cập nhật
- Website hoạt động tại: **https://hanitav.github.io/triet-utt/**

---

## 🔍 Kiểm tra và Xử lý lỗi

### ✅ Kiểm tra sau khi deploy

1. **Kiểm tra nhánh gh-pages:**
   ```
   https://github.com/hanitav/triet-utt/tree/gh-pages
   ```
   - Xác nhận có file `index.html` và các file khác

2. **Kiểm tra GitHub Pages Settings:**
   - Vào **Settings** → **Pages**
   - Xác nhận: Branch = `gh-pages`, Folder = `/ (root)`
   - Status: "Your site is live at..."

3. **Kiểm tra website:**
   - Mở: **https://hanitav.github.io/triet-utt/**
   - Test các tính năng: Học tập, Thi thử, Giả lập

### ⚠️ Xử lý lỗi thường gặp

#### Lỗi 1: "404 Not Found" sau khi deploy

**Nguyên nhân:**
- GitHub Pages chưa build xong
- Nhánh `gh-pages` chưa có nội dung
- Cấu hình Pages chưa đúng

**Giải pháp:**
1. Đợi 2-5 phút và refresh lại
2. Kiểm tra nhánh `gh-pages` có file chưa
3. Kiểm tra Settings → Pages đã cấu hình đúng chưa
4. Xóa cache trình duyệt (Ctrl+Shift+R)

#### Lỗi 2: "gh-pages branch doesn't exist"

**Nguyên nhân:**
- Lần đầu deploy, nhánh `gh-pages` chưa được tạo

**Giải pháp:**
- Workflow/script sẽ tự động tạo nhánh này
- Nếu vẫn lỗi, thử tạo thủ công:
  ```bash
  git checkout -b gh-pages
  git push -u origin gh-pages
  ```

#### Lỗi 3: "Permission denied" khi chạy script

**Nguyên nhân:**
- Chưa đăng nhập Git
- Không có quyền push vào repository

**Giải pháp:**
```bash
# Cấu hình Git (nếu chưa)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Kiểm tra quyền
git remote -v

# Nếu cần, thêm SSH key hoặc Personal Access Token
```

#### Lỗi 4: Website không cập nhật sau khi deploy

**Nguyên nhân:**
- Cache trình duyệt
- GitHub Pages chưa build xong

**Giải pháp:**
1. Xóa cache trình duyệt: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
2. Đợi 2-5 phút và refresh lại
3. Kiểm tra nhánh `gh-pages` có commit mới chưa

#### Lỗi 5: "Node.js not found" khi chạy script

**Nguyên nhân:**
- Node.js chưa được cài đặt hoặc chưa có trong PATH

**Giải pháp:**
1. Cài đặt Node.js: https://nodejs.org/
2. Khởi động lại terminal/CMD
3. Kiểm tra: `node --version`

---

## 📝 Best Practices

### 1. Workflow đề xuất:

```
1. Làm việc trên nhánh main
2. Commit và push code
3. Chạy GitHub Actions workflow
4. Kiểm tra website sau 2-5 phút
```

### 2. Commit message:

Sử dụng commit message rõ ràng:
- ✅ `"Add new exam questions"`
- ✅ `"Update UI design"`
- ✅ `"Fix bug in exam mode"`
- ❌ `"update"` (quá mơ hồ)

### 3. Kiểm tra trước khi deploy:

- ✅ Test local trước (dùng Python server)
- ✅ Kiểm tra không có lỗi JavaScript trong console
- ✅ Kiểm tra responsive trên mobile

### 4. Version management:

- Script tự động cập nhật `version.json` với commit hash
- Version được hiển thị trên website

---

## 🎉 Hoàn tất!

Sau khi deploy thành công, website sẽ có sẵn tại:

**🌐 https://hanitav.github.io/triet-utt/**

### Các lần deploy tiếp theo:

Chỉ cần:
1. Commit code mới
2. Chạy GitHub Actions workflow hoặc script deploy
3. Đợi 1-2 phút
4. Website tự động cập nhật!

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
- ✅ GitHub Actions logs (tab Actions)
- ✅ GitHub Pages logs (Settings → Pages)
- ✅ Console trình duyệt (F12)

---

**Chúc bạn deploy thành công! 🚀**
