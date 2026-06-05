# OpsPilot — Production DevOps Platform

> End-to-end DevOps implementation on AWS Free Tier. Zero cost. Enterprise patterns.

[![CI/CD Pipeline](https://github.com/bilalwaheed24/opspilot/actions/workflows/ci.yml/badge.svg)](https://github.com/bilalwaheed24/opspilot/actions/workflows/ci.yml)

## Live Demo
- Frontend: http://34.195.93.217:30080
- Grafana: http://52.21.247.234:30091

## Architecture

![Architecture](docs/architecture.png)

## Tech Stack

| Category | Tools |
|----------|-------|
| Cloud | AWS EC2, VPC, EIP |
| IaC | Terraform |
| Containers | Docker, GHCR |
| Orchestration | K3s Kubernetes |
| CI/CD | GitHub Actions |
| GitOps | ArgoCD |
| Monitoring | Prometheus, Grafana |
| Security | OPA Gatekeeper, Trivy |

## What This Demonstrates

| Concern | Implementation |
|---------|---------------|
| IaC | Terraform modules, S3 state, DynamoDB lock |
| Orchestration | K3s 2-node cluster, HPA, NetworkPolicies |
| GitOps | ArgoCD automated sync, self-heal |
| Security | OPA policies, Trivy CVE scanning |
| Observability | Prometheus metrics, Grafana dashboards |
| Cost | $0/month — free tier |

## Services

| Service | Stack | Port |
|---------|-------|------|
| Frontend | React + Nginx | 30080 |
| API | Node.js + Express | 30081 |
| Worker | Python | — |

## CI/CD Pipeline

Every `git push` to main:
1. Lint + Unit Tests (Jest)
2. Docker Build
3. Trivy Security Scan
4. Push to GHCR
5. Deploy to K3s

## Infrastructure

```bash
# Provision everything
cd infra && terraform apply

# Deploy services
kubectl apply -k k8s/overlays/prod
```

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| 2x EC2 m7i-flex.large | Free tier | $0 |
| S3 | 5GB free | $0 |
| DynamoDB | 25GB free | $0 |
| **Total** | | **$0** |

## Repository Structure
opspilot/
├── infra/          # Terraform IaC
├── services/       # Microservices
│   ├── api/        # Node.js API
│   ├── worker/     # Python worker
│   └── frontend/   # React UI
├── k8s/            # Kubernetes manifests
├── security/       # OPA policies
└── .github/        # CI/CD workflows


## Author

Bilal Waheed — Junior DevOps Engineer
- GitHub: github.com/bilalwaheed24
- Email: thebilalwaheed@gmail.com