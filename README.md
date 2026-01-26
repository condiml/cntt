# NEO Education - Nền tảng học tập thông minh

Ứng dụng web tĩnh để ôn thi trắc nghiệm với các tính năng: Học tập, Thi thử, Giả lập thi.

## 🚀 Cách chạy ứng dụng

**Lưu ý quan trọng:** Ứng dụng này cần chạy qua web server (không thể mở trực tiếp file HTML) vì sử dụng `fetch()` để tải dữ liệu JSON, nếu mở trực tiếp sẽ gặp lỗi CORS.

### Phương pháp 1: Sử dụng Python (Khuyến nghị)

Python thường đã được cài đặt sẵn trên Windows 10/11.

#### Python 3.x:
```bash
# Di chuyển vào thư mục dự án
cd E:\WEB\triet-utt

# Chạy server (Python 3)
python -m http.server 8000
```

#### Python 2.x (nếu có):
```bash
python -m SimpleHTTPServer 8000
```

Sau đó mở trình duyệt và truy cập: **http://localhost:8000**

### Phương pháp 2: Sử dụng Node.js

Nếu bạn đã cài đặt Node.js:

```bash
# Cài đặt http-server (chỉ cần làm 1 lần)
npm install -g http-server

# Chạy server
cd E:\WEB\triet-utt
http-server -p 8000
```

Hoặc sử dụng `npx` (không cần cài đặt):
```bash
npx http-server -p 8000
```

Truy cập: **http://localhost:8000**

### Phương pháp 3: Sử dụng VS Code Live Server

1. Cài đặt extension **Live Server** trong VS Code
2. Click chuột phải vào file `index.html`
3. Chọn **"Open with Live Server"**

### Phương pháp 4: Sử dụng PHP (nếu đã cài đặt)

```bash
php -S localhost:8000
```

### Phương pháp 5: Sử dụng PowerShell (Windows)

```powershell
# Tạo một web server đơn giản bằng PowerShell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Server đang chạy tại http://localhost:8000"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    $filePath = Join-Path $PWD $localPath.TrimStart('/')
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
```

## 📁 Cấu trúc dự án

```
triet-utt/
├── index.html          # Trang chủ
├── study.html          # Trang học tập
├── exam.html           # Trang thi thử
├── simulation.html     # Trang giả lập thi
├── settings.html       # Trang cài đặt
├── js/                 # JavaScript files
├── css/                # Stylesheet files
├── assets/             # Hình ảnh, logo
└── subjects/           # Dữ liệu môn học
    ├── utt/            # Môn học UTT
    └── ptit/           # Môn học PTIT
```

## 🎯 Tính năng

- **Học tập thông minh**: Ôn luyện với AI, video bài giảng và Flashcard
- **Thi thử**: Kho đề thi phong phú với nhiều chương
- **Giả lập thi**: Mô phỏng kỳ thi thật với thời gian và áp lực
- **Theo dõi tiến độ**: Thống kê số câu đã học, tỷ lệ chính xác

## 🔧 Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Web server đơn giản (Python, Node.js, hoặc bất kỳ web server nào)

## 📝 Ghi chú

- Dữ liệu được lưu trữ trong `localStorage` của trình duyệt
- Không cần cơ sở dữ liệu hay backend server
- Ứng dụng hoạt động hoàn toàn offline sau khi tải lần đầu

## 🚢 Deploy lên GitHub Pages

> 📖 **Xem hướng dẫn chi tiết:** [DEPLOY.md](DEPLOY.md)

Có 2 cách để deploy ứng dụng lên GitHub Pages:

### Phương pháp 1: Sử dụng GitHub Actions (Khuyến nghị) ⭐

Đây là cách đơn giản nhất, không cần cài đặt gì trên máy local.

#### Bước 1: Cấu hình GitHub Pages

1. Truy cập repository trên GitHub: `https://github.com/hanitav/triet-utt`
2. Vào **Settings** → **Pages** (ở sidebar bên trái)
3. Trong phần **Source**, chọn:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

#### Bước 2: Chạy GitHub Actions Workflow

1. Vào tab **Actions** trong repository
2. Chọn workflow **"Manual Deploy to GitHub Pages"** ở sidebar bên trái
3. Click nút **"Run workflow"** ở góc phải trên
4. (Tùy chọn) Nhập commit message (mặc định: "Update site")
5. Click **"Run workflow"** để bắt đầu deployment

#### Bước 3: Chờ deployment hoàn tất

- Workflow sẽ tự động:
  - Cập nhật version info
  - Commit và push lên nhánh `main`
  - Tạo/merge nhánh `gh-pages`
  - Deploy lên GitHub Pages

#### Bước 4: Truy cập website

Sau khi deployment hoàn tất (thường mất 1-2 phút), website sẽ có sẵn tại:
**https://hanitav.github.io/triet-utt/**

> 💡 **Lưu ý**: Lần đầu tiên có thể mất vài phút để GitHub Pages build và publish website.

---

### Phương pháp 2: Sử dụng Script Deploy (Local)

Nếu bạn muốn deploy từ máy local:

#### Yêu cầu:
- Git đã được cài đặt và cấu hình
- Node.js đã được cài đặt (để chạy `update_version.js`)
- Đã có quyền push vào repository

#### Các bước:

1. **Đảm bảo đã commit tất cả thay đổi:**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

2. **Chạy script deploy:**

   **Windows:**
   ```cmd
   deploy.cmd "Update site"
   ```

   **Linux/Mac:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh "Update site"
   ```

3. **Script sẽ tự động:**
   - Cập nhật version info
   - Pull latest changes từ main
   - Commit và push lên nhánh `main`
   - Chuyển sang nhánh `gh-pages`
   - Merge `main` vào `gh-pages`
   - Push lên GitHub
   - Chuyển lại về nhánh `main`

4. **Kiểm tra kết quả:**
   - Truy cập: **https://hanitav.github.io/triet-utt/**
   - Nếu chưa thấy, đợi 1-2 phút để GitHub Pages build

---

### 🔍 Kiểm tra sau khi Deploy

1. **Kiểm tra nhánh gh-pages:**
   - Vào repository → **Branches**
   - Xác nhận nhánh `gh-pages` đã được tạo/cập nhật

2. **Kiểm tra GitHub Pages:**
   - Vào **Settings** → **Pages**
   - Xác nhận status là "Your site is live at..."

3. **Kiểm tra website:**
   - Mở: **https://hanitav.github.io/triet-utt/**
   - Kiểm tra các tính năng hoạt động bình thường

---

### ⚠️ Xử lý lỗi thường gặp

**Lỗi: "gh-pages branch doesn't exist"**
- Giải pháp: Workflow sẽ tự động tạo nhánh `gh-pages` lần đầu tiên

**Lỗi: "404 Not Found" sau khi deploy**
- Giải pháp: Đợi 2-5 phút, GitHub Pages cần thời gian để build
- Kiểm tra Settings → Pages xem đã cấu hình đúng chưa

**Lỗi: "Permission denied" khi chạy script**
- Giải pháp: Đảm bảo đã đăng nhập Git và có quyền push vào repository

**Website không cập nhật sau khi deploy**
- Giải pháp: Xóa cache trình duyệt (Ctrl+Shift+R) hoặc đợi vài phút

---

### 📝 Lưu ý quan trọng

- **Nhánh `gh-pages`**: Đây là nhánh đặc biệt mà GitHub Pages sử dụng để host website
- **Không chỉnh sửa trực tiếp nhánh `gh-pages`**: Luôn làm việc trên nhánh `main`, sau đó deploy
- **Version auto-update**: Script sẽ tự động cập nhật `version.json` với commit hash mới nhất
- **Commit message**: Có thể tùy chỉnh message khi chạy workflow hoặc script
