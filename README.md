# ArgoCD App of Apps Pattern - Bootstrap Cluster

This repository contains the ArgoCD deployment configuration using the **App of Apps** pattern.

## Structure

```
├── bootstrap/              # Bootstrap application (root app)
│   └── bootstrap-app.yaml  # Points to the apps directory
└── apps/                   # Contains all application definitions
    └── sample-app/         # Sample application
        ├── applicationset.yaml  # ApplicationSet for sample-app
        └── deployment.yaml      # Kubernetes manifests for sample-app
```

## How It Works

1. **Bootstrap Application**: The `bootstrap/bootstrap-app.yaml` is the root Application that ArgoCD uses to sync the `apps/` directory.

2. **ApplicationSet**: Inside `apps/sample-app/applicationset.yaml`, an ApplicationSet generates Applications for each environment/cluster.

3. **Sample App**: The `apps/sample-app/deployment.yaml` contains the actual Kubernetes resources (Deployment + Service).

## Deployment Steps

### 1. Install ArgoCD
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2. Update Configuration

The repository URL has been configured to: `https://github.com/Hoangvu75/k8s_manifest_2`

If you need to change it, edit the following files:
- `bootstrap/bootstrap-app.yaml` - Update `repoURL`
- `apps/sample-app/applicationset.yaml` - Update `repoURL`

### 3. Apply Bootstrap Application
```bash
kubectl apply -f bootstrap/bootstrap-app.yaml
```

### 4. Access ArgoCD UI
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Get initial admin password:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## Customization

- Add more applications by creating new directories under `apps/`
- Modify the ApplicationSet generators for multi-cluster deployments
- Adjust resource limits in `deployment.yaml` based on your needs
