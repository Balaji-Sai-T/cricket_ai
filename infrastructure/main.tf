# Terraform configuration for Cricket AI Infrastructure
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }

  backend "s3" {
    bucket = "cricket-ai-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = var.aws_region
}

# EKS Cluster
resource "aws_eks_cluster" "cricket_ai_cluster" {
  name     = "cricket-ai-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = [
      aws_subnet.private_subnet_a.id,
      aws_subnet.private_subnet_b.id,
      aws_subnet.public_subnet_a.id,
      aws_subnet.public_subnet_b.id,
    ]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_service_policy,
  ]

  tags = {
    Name        = "cricket-ai-cluster"
    Environment = "production"
    Project     = "cricket-ai"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "cricket_ai_nodes" {
  cluster_name    = aws_eks_cluster.cricket_ai_cluster.name
  node_group_name = "cricket-ai-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  instance_types = ["t3.medium"]
  capacity_type  = "ON_DEMAND"

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]

  tags = {
    Environment = "production"
    Project     = "cricket-ai"
  }
}

# RDS Instance for ML Model Storage
resource "aws_db_instance" "cricket_ai_db" {
  allocated_storage      = 20
  max_allocated_storage  = 100
  storage_type          = "gp2"
  engine                = "postgres"
  engine_version        = "15.4"
  instance_class        = "db.t3.micro"
  identifier            = "cricket-ai-db"
  
  db_name  = "cricketai"
  username = "admin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.cricket_ai_db_subnet_group.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Sun:04:00-Sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "cricket-ai-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  tags = {
    Name        = "cricket-ai-database"
    Environment = "production"
    Project     = "cricket-ai"
  }
}

# S3 Bucket for ML Models and Images
resource "aws_s3_bucket" "cricket_ai_storage" {
  bucket = "cricket-ai-ml-storage-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "cricket-ai-storage"
    Environment = "production"
    Project     = "cricket-ai"
  }
}

resource "aws_s3_bucket_versioning" "cricket_ai_storage_versioning" {
  bucket = aws_s3_bucket.cricket_ai_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cricket_ai_storage_encryption" {
  bucket = aws_s3_bucket.cricket_ai_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "cricket_ai_logs" {
  name              = "/aws/eks/cricket-ai-cluster/cluster"
  retention_in_days = 14

  tags = {
    Environment = "production"
    Project     = "cricket-ai"
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Random ID for bucket naming
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Outputs
output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.cricket_ai_cluster.endpoint
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.cricket_ai_cluster.name
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.cricket_ai_db.endpoint
  sensitive   = true
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.cricket_ai_storage.bucket
}