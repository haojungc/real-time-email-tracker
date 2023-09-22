resource "aws_api_gateway_rest_api" "email_tracker_api_gateway" {
  name = "email-tracker-api-gateway"
}

# POST: Create email status entry
resource "aws_api_gateway_resource" "creation_lambda_resource" {
  parent_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.root_resource_id
  path_part   = "email-thread-status"
  rest_api_id = aws_api_gateway_rest_api.email_tracker_api_gateway.id
}

resource "aws_api_gateway_method" "creation_lambda_method" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.creation_lambda_resource.id
  rest_api_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.id
}

resource "aws_api_gateway_integration" "creation_lambda_integration" {
  resource_id             = aws_api_gateway_resource.creation_lambda_resource.id
  rest_api_id             = aws_api_gateway_rest_api.email_tracker_api_gateway.id
  http_method             = aws_api_gateway_method.creation_lambda_method.http_method
  integration_http_method = aws_api_gateway_method.creation_lambda_method.http_method
  type                    = "AWS_PROXY"

  depends_on = [aws_api_gateway_method.creation_lambda_method]
  uri        = aws_lambda_function.lambda_create.invoke_arn
}

# GET: Get email status
resource "aws_api_gateway_resource" "retrieval_lambda_resource" {
  parent_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.root_resource_id
  path_part   = "email-thread-status"
  rest_api_id = aws_api_gateway_rest_api.email_tracker_api_gateway.id
}

resource "aws_api_gateway_method" "retrieval_lambda_method" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.retrieval_lambda_resource.id
  rest_api_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.id
}

resource "aws_api_gateway_integration" "retrieval_lambda_integration" {
  resource_id             = aws_api_gateway_resource.retrieval_lambda_resource.id
  rest_api_id             = aws_api_gateway_rest_api.email_tracker_api_gateway.id
  http_method             = aws_api_gateway_method.retrieval_lambda_method.http_method
  integration_http_method = aws_api_gateway_method.retrieval_lambda_method.http_method
  type                    = "AWS_PROXY"

  depends_on = [aws_api_gateway_method.retrieval_lambda_method]
  uri        = aws_lambda_function.lambda_get.invoke_arn
}

# PUT: Update email status
resource "aws_api_gateway_resource" "update_lambda_resource" {
  parent_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.root_resource_id
  path_part   = "email-thread-status"
  rest_api_id = aws_api_gateway_rest_api.email_tracker_api_gateway.id
}

resource "aws_api_gateway_method" "update_lambda_method" {
  authorization = "NONE"
  http_method   = "PUT"
  resource_id   = aws_api_gateway_resource.update_lambda_resource.id
  rest_api_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.id
}

resource "aws_api_gateway_integration" "update_lambda_integration" {
  resource_id             = aws_api_gateway_resource.update_lambda_resource.id
  rest_api_id             = aws_api_gateway_rest_api.email_tracker_api_gateway.id
  http_method             = aws_api_gateway_method.update_lambda_method.http_method
  integration_http_method = aws_api_gateway_method.update_lambda_method.http_method
  type                    = "AWS_PROXY"

  depends_on = [aws_api_gateway_method.update_lambda_method]
  uri        = aws_lambda_function.lambda_update.invoke_arn
}

resource "aws_api_gateway_deployment" "email_tracker_deployment" {
  rest_api_id = aws_api_gateway_rest_api.email_tracker_api_gateway.id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.creation_lambda_resource.id,
      aws_api_gateway_method.creation_lambda_method.id,
      aws_api_gateway_integration.creation_lambda_integration.id,
      aws_api_gateway_resource.retrieval_lambda_resource.id,
      aws_api_gateway_method.retrieval_lambda_method.id,
      aws_api_gateway_integration.retrieval_lambda_integration.id,
      aws_api_gateway_resource.update_lambda_resource.id,
      aws_api_gateway_method.update_lambda_method.id,
      aws_api_gateway_integration.update_lambda_integration.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "email_tracker_stage" {
  deployment_id = aws_api_gateway_deployment.email_tracker_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.email_tracker_api_gateway.id
  stage_name    = "dev"
}
