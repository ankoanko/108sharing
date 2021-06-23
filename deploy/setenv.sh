#!/bin/sh -l

if [ "$GITHUB_REF" = "refs/heads/release/staging" ]; then
  echo "::set-env name=SHORT_ENV_NAME::stg";
  echo "::set-env name=ECS_CLUSTER_NAME::sharing108-stg";
  echo "::set-env name=ECS_SERVICE_NAME::sharing108-stg";
  echo "::set-env name=ECS_TASK_NAME::sharing108-stg";
  # echo "::set-env name=USE_GITHUB_PACKAGE_REGISTRY::1";
  echo "::set-env name=ECR_REPOSITORY::sharing108-stg";
  echo "::set-env name=AWS_REGION::us-west-2";
fi
