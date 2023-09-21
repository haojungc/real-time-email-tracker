variable "tags" {
  description = "default tags"
  type        = map(string)
  default = {
    Project     = "email-tracker"
    Environment = "dev-terraform"
  }
}
