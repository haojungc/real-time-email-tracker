locals {
  src_dir     = "${path.module}/../backend/lambda"
  archive_dir = "${path.module}/dist"
  filenames = {
    create = "${local.src_dir}/create-thread-status/index.js"
    get    = "${local.src_dir}/get-thread-status/index.js"
    update = "${local.src_dir}/update-thread-status/index.js"
  }
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_role_for_lambda_create" {
  name               = "lambda-create-thread-status"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role" "iam_role_for_lambda_get" {
  name               = "lambda-get-thread-status"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role" "iam_role_for_lambda_update" {
  name               = "lambda-update-thread-status"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "archive_file" "archive_for_lambda_create" {
  type        = "zip"
  source_file = local.filenames["create"]
  output_path = "${local.archive_dir}/${filesha256(local.filenames["create"])}.zip"
}

data "archive_file" "archive_for_lambda_get" {
  type        = "zip"
  source_file = local.filenames["get"]
  output_path = "${local.archive_dir}/${filesha256(local.filenames["get"])}.zip"
}

data "archive_file" "archive_for_lambda_update" {
  type        = "zip"
  source_file = local.filenames["update"]
  output_path = "${local.archive_dir}/${filesha256(local.filenames["update"])}.zip"
}

resource "aws_lambda_function" "lambda_create" {
  description   = "Creates an email thread status entry in DynamoDB"
  filename      = data.archive_file.archive_for_lambda_create.output_path
  function_name = "create-thread-status-lambda"
  role          = aws_iam_role.iam_role_for_lambda_create.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.archive_for_lambda_create.output_base64sha256

  runtime = "nodejs18.x"
}

resource "aws_lambda_function" "lambda_get" {
  description   = "Retrieves an email thread status from DynamoDB"
  filename      = data.archive_file.archive_for_lambda_get.output_path
  function_name = "get-thread-status-lambda"
  role          = aws_iam_role.iam_role_for_lambda_get.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.archive_for_lambda_get.output_base64sha256

  runtime = "nodejs18.x"
}

resource "aws_lambda_function" "lambda_update" {
  description   = "Updates an email thread status in DynamoDB"
  filename      = data.archive_file.archive_for_lambda_update.output_path
  function_name = "update-thread-status-lambda"
  role          = aws_iam_role.iam_role_for_lambda_update.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.archive_for_lambda_update.output_base64sha256

  runtime = "nodejs18.x"
}
