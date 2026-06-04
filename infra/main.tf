resource "aws_key_pair" "opspilot" {
  key_name   = "opspilot-key"
  public_key = file("~/.ssh/opspilot.pub")
}

module "vpc" {
  source = "./modules/vpc"
}

module "security" {
  source = "./modules/security"
  vpc_id = module.vpc.vpc_id
}

module "k3s_node" {
  source            = "./modules/ec2"
  instance_name     = "opspilot-k3s"
  instance_type     = "m7i-flex.large"
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.security.ec2_sg_id
  key_name          = aws_key_pair.opspilot.key_name
}

module "monitoring_node" {
  source            = "./modules/ec2"
  instance_name     = "opspilot-monitoring"
  instance_type     = "m7i-flex.large"
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.security.ec2_sg_id
  key_name          = aws_key_pair.opspilot.key_name
}

output "k3s_ip"        { value = module.k3s_node.public_ip }
output "monitoring_ip" { value = module.monitoring_node.public_ip }
