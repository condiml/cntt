# 🚀 Hướng dẫn Deploy lên Repository GitHub Mới

Hướng dẫn chi tiết để tạo repository mới trên GitHub và deploy ứng dụng lên GitHub Pages.

## 📋 Các bước thực hiện

### Bước 1: Tạo Repository Mới trên GitHub

1. **Đăng nhập vào GitHub account mới của bạn**
   - Truy cập: https://github.com
   - Đăng nhập với account bạn muốn sử dụng

2. **Tạo repository mới:**
   - Click nút **"+"** ở góc phải trên → chọn **"New repository"**
   - Hoặc truy cập: https://github.com/new

3. **Điền thông tin repository:**
   - **Repository name**: `triet-utt` (hoặc tên bạn muốn)
   - **Description**: `NEO Education - Nền tảng học tập thông minh` (tùy chọn)
   - **Visibility**: 
     - ✅ **Public** (khuyến nghị - để GitHub Pages miễn phí)
     - ⚠️ **Private** (cần GitHub Pro để dùng GitHub Pages)
   - **KHÔNG** tích vào:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   - (Để trống vì code đã có sẵn)

4. **Click "Create repository"**

5. **Lưu lại URL repository:**
   - URL sẽ có dạng: `https://github.com/YOUR_USERNAME/triet-utt.git`
   - Thay `YOUR_USERNAME` bằng username GitHub của bạn

---

### Bước 2: Cấu hình Git Remote

Sau khi tạo repository, bạn cần thay đổi remote URL để trỏ đến repository mới.

#### Cách 1: Thay đổi remote URL (Khuyến nghị)

```powershell
# Di chuyển vào thư mục dự án
cd E:\WEB\triet-utt

# Xem remote hiện tại
git remote -v

# Thay đổi remote URL (thay YOUR_USERNAME và REPO_NAME)
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Xác nhận đã thay đổi
git remote -v
```

#### Cách 2: Xóa và thêm remote mới

```powershell
# Xóa remote cũ
git remote remove origin

# Thêm remote mới (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Xác nhận
git remote -v
```

---

### Bước 3: Chuyển về nhánh main và Push Code

```powershell
# Chuyển về nhánh main
git checkout main

# Nếu chưa có nhánh main, tạo từ nhánh hiện tại
# git checkout -b main

# Push code lên repository mới
git push -u origin main
```

**Lưu ý về xác thực:**
- Nếu được hỏi username/password, sử dụng:
  - **Username**: GitHub username của bạn
  - **Password**: Personal Access Token (PAT) - không dùng password GitHub
- Nếu chưa có PAT, xem hướng dẫn ở cuối file này

---

### Bước 4: Cấu hình GitHub Pages

1. **Vào Settings của repository:**
   - Trong repository mới, click tab **Settings**
   - Scroll xuống phần **Pages** (sidebar bên trái)

2. **Cấu hình Source:**
   - **Source**: Chọn **Deploy from a branch**
   - **Branch**: Chọn `gh-pages`
   - **Folder**: Chọn `/ (root)`
   - Click **Save**

3. **Lưu ý:**
   - Lúc này sẽ hiện "gh-pages branch not found" - đây là bình thường
   - Chúng ta sẽ tạo nhánh `gh-pages` ở bước tiếp theo

---

### Bước 5: Deploy lên GitHub Pages

Có 2 cách để deploy:

#### Cách 1: Sử dụng GitHub Actions (Khuyến nghị)

1. **Cập nhật workflow file (nếu cần):**
   - File `.github/workflows/manual-deploy.yml` đã có sẵn
   - Có thể cần cập nhật URL trong file này

2. **Chạy workflow:**
   - Vào tab **Actions** trong repository
   - Chọn **"Manual Deploy to GitHub Pages"**
   - Click **"Run workflow"**
   - Nhập commit message (tùy chọn)
   - Click **"Run workflow"**

3. **Chờ deployment hoàn tất** (1-2 phút)

#### Cách 2: Deploy thủ công bằng Git

```powershell
# Đảm bảo đang ở nhánh main
git checkout main

# Tạo nhánh gh-pages từ main
git checkout -b gh-pages

# Push nhánh gh-pages lên GitHub
git push -u origin gh-pages

# Chuyển lại về main
git checkout main
```

---

### Bước 6: Kiểm tra Website

Sau khi deploy (đợi 2-5 phút):

1. **Kiểm tra nhánh gh-pages:**
   - Vào repository → **Code** → **Branches**
   - Xác nhận nhánh `gh-pages` đã được tạo

2. **Kiểm tra GitHub Pages:**
   - Vào **Settings** → **Pages**
   - Xác nhận status: "Your site is live at..."

3. **Truy cập website:**
   - URL sẽ có dạng: `https://YOUR_USERNAME.github.io/REPO_NAME/`
   - Ví dụ: `https://yourusername.github.io/triet-utt/`

---

## 🔐 Tạo Personal Access Token (PAT)

Nếu Git yêu cầu xác thực, bạn cần tạo PAT:

### Các bước:

1. **Vào GitHub Settings:**
   - Click avatar → **Settings**
   - Hoặc: https://github.com/settings/profile

2. **Tạo Token:**
   - Scroll xuống → **Developer settings**
   - Click **Personal access tokens** → **Tokens (classic)**
   - Click **Generate new token** → **Generate new token (classic)**

3. **Cấu hình Token:**
   - **Note**: `Deploy triet-utt` (tên tùy ý)
   - **Expiration**: Chọn thời hạn (khuyến nghị: 90 days hoặc No expiration)
   - **Scopes**: Tích vào:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)

4. **Generate và Copy:**
   - Click **Generate token**
   - **QUAN TRỌNG**: Copy token ngay (chỉ hiện 1 lần)
   - Lưu token ở nơi an toàn

5. **Sử dụng Token:**
   - Khi Git hỏi password, paste token này (không phải password GitHub)

---

## 📝 Script Tự Động (Tùy chọn)

Bạn có thể tạo script để tự động hóa quá trình:

### Script PowerShell: `setup_new_repo.ps1`

```powershell
# Nhập thông tin repository mới
$username = Read-Host "Nhập GitHub username"
$repoName = Read-Host "Nhập tên repository"

# Thay đổi remote
git remote set-url origin "https://github.com/$username/$repoName.git"

# Chuyển về main
git checkout main

# Push code
git push -u origin main

# Tạo và push nhánh gh-pages
git checkout -b gh-pages
git push -u origin gh-pages

# Chuyển lại về main
git checkout main

Write-Host "✅ Hoàn tất! Vào Settings → Pages để cấu hình GitHub Pages"
Write-Host "🌐 Website sẽ có tại: https://$username.github.io/$repoName/"
```

---

## ⚠️ Lưu ý quan trọng

1. **Repository phải là Public** để dùng GitHub Pages miễn phí
   - Private repo cần GitHub Pro ($4/tháng)

2. **URL website:**
   - Format: `https://USERNAME.github.io/REPO_NAME/`
   - Nếu repo tên là `USERNAME.github.io`, URL sẽ là: `https://USERNAME.github.io/`

3. **Nhánh gh-pages:**
   - Không chỉnh sửa trực tiếp nhánh này
   - Luôn làm việc trên `main`, sau đó deploy

4. **Lần đầu deploy:**
   - Có thể mất 2-5 phút để GitHub Pages build
   - Kiên nhẫn đợi và refresh lại

---

## 🎉 Hoàn tất!

Sau khi hoàn tất các bước trên, website của bạn sẽ có sẵn tại:

**🌐 https://YOUR_USERNAME.github.io/REPO_NAME/**

### Các lần deploy tiếp theo:

Chỉ cần:
1. Commit code mới trên nhánh `main`
2. Chạy GitHub Actions workflow hoặc script deploy
3. Website tự động cập nhật!

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
- ✅ Kiểm tra GitHub Actions logs
- ✅ Kiểm tra Settings → Pages
- ✅ Xem file `DEPLOY.md` để biết thêm chi tiết

**Chúc bạn deploy thành công! 🚀**
