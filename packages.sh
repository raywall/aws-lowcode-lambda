#!/bin/sh

PROJECT=0 # 1: App, 2: Layer

while [ "$#" -gt 0 ]; do
  case "$1" in
    --app)
      PROJECT=1
      ;;
    --layer)
      PROJECT=2
      ;;
    *)
      echo "command not recognized: $1"
      exit 1
      ;;
  esac
  shift
done

# app package
if [ "$PROJECT" = 1 ]; then
    app_output_zip="lowcode-lambda-tester.zip"
    app_project_folder="app"

    rm -f "$app_output_zip"
    cd "$app_project_folder" || exit

    zip -r "$app_output_zip" . -x "*.git*" -x "*.DS_Store*"
    mv "$app_output_zip" ../.package/

    echo "Arquivo ZIP '$app_output_zip' gerado com sucesso."
fi

# layer package
if [ "$PROJECT" = 2 ]; then
    layer_output_zip="lowcode-lambda-layer.zip"
    layer_project_folder="layer/lowcode-lambda-layer"

    rm -f "$layer_output_zip"
    cd "$layer_project_folder" || exit

    zip -r "$layer_output_zip" . -x "*.git*" -x "*.DS_Store*"
    mv "$layer_output_zip" ../../.package/

    echo "Arquivo ZIP '$layer_output_zip' gerado com sucesso."
fi