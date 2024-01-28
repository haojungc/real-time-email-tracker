variable "AWS_ACCOUNT_ID" {
  description = "ID for AWS account"
  type        = string
}

variable "AWS_REGION" {
  description = "AWS region"
  type        = string
}

variable "ENV" {
  description = "AWS environment (dev or prod)"
  type        = string
}

variable "tags" {
  description = "default tags"
  type        = map(string)
  default = {
    Project     = "email-tracker"
    Environment = "dev-terraform"
  }
}
