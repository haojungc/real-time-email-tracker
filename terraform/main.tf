locals {
  aws_region = "us-west-1"
}

provider "aws" {
  region = local.aws_region

  default_tags {
    tags = var.tags
  }
}
