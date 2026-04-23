# Hướng dẫn sử dụng Helm Chart với ArgoCD

## Cấu trúc
```
helm-chart/
├── Chart.yaml          # Định nghĩa chart metadata
├── values.yaml         # Quản lý tất cả biến (bao gồm repoURL)
└── templates/
    ├── bootstrap-app.yaml      # Bootstrap Application
    └── applicationset.yaml     # Sample ApplicationSet
```

## Cách thay đổi repoURL
Chỉ cần sửa **1 dòng duy nhất** trong `values.yaml`:

```yaml
global:
  repoURL: https://github.com/Hoangvu75/k8s_manifest_2  # <-- Sửa ở đây
```

## Cách ArgoCD hoạt động
1. ArgoCD đọc `bootstrap/bootstrap-app.yaml`
2. Trỏ vào thư mục `helm-chart` với `helm:` configuration
3. ArgoCD tự động render template từ `values.yaml`
4. **Không cần chạy lệnh build thủ công**

## Override giá trị (tuỳ chọn)
Nếu muốn override giá trị từ `values.yaml`, tạo file `values-override.yaml`:

```yaml
global:
  repoURL: https://github.com/new-repo/manifests
```

Sau đó cập nhật `bootstrap-app.yaml`:
```yaml
spec:
  source:
    helm:
      releaseName: k8s-manifest
      valueFiles:
        - values-override.yaml
```

## Lợi ích
✅ repoURL chỉ định nghĩa 1 nơi duy nhất (`values.yaml`)  
✅ ArgoCD tự động render template, không cần build thủ công  
✅ Dễ dàng override cho từng môi trường (dev/staging/prod)  
✅ Tương thích native với ArgoCD  
