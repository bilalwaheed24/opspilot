terraform {
  backend "s3" {
    bucket         = "opspilot-tf-state-290172088615"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "opspilot-tf-lock"
    encrypt        = true
  }
}
